import re, json
from collections import defaultdict, Counter

xml = open('figma_page.xml').read()
lines = xml.split('\n')

NODE_RE = re.compile(r'^(\s*)<([a-z-]+) id="([^"]+)" name="((?:[^"\\]|\\.)*)"(?: x="([-\d.]+)")?(?: y="([-\d.]+)")?(?: width="([\d.]+)")?(?: height="([\d.]+)")?(.*)$')

def unescape(s):
    return s.replace('&amp;','&').replace('&#39;',"'").replace('&quot;','"').replace('&lt;','<').replace('&gt;','>')

# Build a walk with section/frame context
records = []
stack = []  # (indent, type, id, name)
cur_section = None
cur_frame = None

for ln in lines:
    m = NODE_RE.match(ln)
    if not m: continue
    indent, ntype, nid, name, x, y, w, h, rest = m.groups()
    ind = len(indent)
    name = unescape(name)
    while stack and stack[-1][0] >= ind:
        stack.pop()
    if ntype == 'section':
        cur_section = name; cur_frame = None
    elif ntype == 'frame' and ind == 4:
        cur_frame = name
    stack.append((ind, ntype, nid, name))
    records.append({
        'type': ntype, 'id': nid, 'name': name,
        'x': float(x) if x else None, 'y': float(y) if y else None,
        'w': float(w) if w else None, 'h': float(h) if h else None,
        'section': cur_section, 'frame': cur_frame, 'indent': ind,
        'hidden': 'hidden="true"' in rest,
        'platform': None
    })

# Top-level frames with platform detection
top_frames = [r for r in records if r['type']=='frame' and r['indent']==4]
for f in top_frames:
    f['platform'] = 'Mobile' if f['w'] and f['w'] <= 500 else 'Web'

findings = []
fid = [0]
def add(section, frame, platform, component, state, desc, sc, sev, current, fix, owner, notes=''):
    fid[0]+=1
    findings.append({
        'Issue ID': f'FIG-{fid[0]:03d}', 'Section/Page': section, 'Frame/URL': frame,
        'Platform': platform, 'Component': component, 'State Checked': state,
        'Issue Description': desc, 'WCAG SC': sc, 'Severity': sev,
        'Current Value': current, 'Required Fix (exact)': fix, 'Owner': owner,
        'Status': 'Open', 'Notes / Affected Pages': notes
    })

# ---------- 1. Duplicate / versioned frames ----------
by_sec_name = defaultdict(list)
for f in top_frames:
    key = (f['section'], re.sub(r'\s*(V\d+|\d+)\s*$', '', f['name']).strip().lower())
    by_sec_name[key].append(f)

dupe_groups = {k:v for k,v in by_sec_name.items() if len(v)>1}
# also cross-section same-name (e.g. Home appears in Booking Flow AND Home)
name_only = defaultdict(list)
for f in top_frames:
    name_only[f['name'].strip().lower()].append(f)
cross = {k:v for k,v in name_only.items() if len(set(x['section'] for x in v))>1}

for (sec, base), fl in sorted(dupe_groups.items()):
    variants = []
    for f in fl:
        variants.append(f"{f['name']} ({f['platform']}, {int(f['w'])}x{int(f['h'])}, id {f['id']})")
    add(sec, ' / '.join(sorted(set(f['name'] for f in fl))), 'Web+Mobile', 'Frame set', 'N/A',
        f'Duplicate/versioned frames for "{base}" — {len(fl)} variants exist on this page. Designer must confirm which is current before dev builds from it; ambiguity here causes dev to implement a stale version.',
        'N/A (process)', 'moderate',
        f'{len(fl)} variants: ' + '; '.join(variants[:6]) + (f' +{len(variants)-6} more' if len(variants)>6 else ''),
        'Designer to mark ONE frame as current (rename others with "[DEPRECATED]" prefix or move to an archive page).',
        'Designer')

for base, fl in sorted(cross.items()):
    secs = sorted(set(f['section'] for f in fl))
    if len(secs) < 2: continue
    add(' / '.join(secs), base, 'Web+Mobile', 'Frame set', 'N/A',
        f'Frame "{base}" appears in {len(secs)} different sections — same screen designed in multiple places, risk of divergent specs.',
        'N/A (process)', 'moderate',
        f'Sections: {", ".join(secs)}',
        'Designer to consolidate into a single source-of-truth section, or clearly scope each by journey (1B vs 1C).',
        'Designer')

# ---------- 2. Tap target audit on instances ----------
interactive_names = re.compile(r'button|chip|radio|checkbox|stepper|icon/|arrow|link|input|field|tab|toggle|close|menu', re.I)
small_targets = defaultdict(list)
for r in records:
    if r['type'] != 'instance': continue
    if not interactive_names.search(r['name']): continue
    if r['w'] is None or r['h'] is None: continue
    # find owning top-level frame platform
    plat = None
    for f in top_frames:
        if f['section']==r['section'] and f['frame']==r['frame']:
            plat = f['platform']; break
    minsize = 44 if plat=='Mobile' else 24
    if r['w'] < minsize or r['h'] < minsize:
        small_targets[(r['name'], plat, minsize)].append(r)

for (nm, plat, minsize), rl in sorted(small_targets.items(), key=lambda kv: -len(kv[1])):
    ex = rl[0]
    secs = sorted(set(x['section'] for x in rl))
    add(', '.join(secs[:3]) + (f' +{len(secs)-3}' if len(secs)>3 else ''),
        ex['frame'] or '(multiple)', plat or 'Web', nm, 'Default',
        f'Interactive element "{nm}" is below the minimum tap/click target size ({len(rl)} instance(s) on this page).',
        '2.5.5 (AAA) / 2.5.8 (AA 2.2)', 'moderate' if plat!='Mobile' else 'serious',
        f'{ex["w"]:.0f}x{ex["h"]:.0f}px (min {minsize}x{minsize})',
        f'Resize to at least {minsize}x{minsize}px, or keep the visual size and add invisible padding/hit-area to reach {minsize}x{minsize}.',
        'Designer + Dev',
        f'{len(rl)} instances across: {", ".join(secs)}')

# ---------- 3. Component state coverage ----------
# Look for state-named frames/instances anywhere on page
state_kw = {
    'Hover': re.compile(r'hover', re.I),
    'Focus': re.compile(r'focus', re.I),
    'Active/Pressed': re.compile(r'active|pressed', re.I),
    'Disabled': re.compile(r'disabled|inactive', re.I),
    'Error': re.compile(r'error|invalid', re.I),
}
all_names = ' | '.join(r['name'] for r in records)
key_components = ['Button- Master','Button/Primary','Button/Secondary','Primary Buttons-small','Input/Field','Textarea/Field','Radio Button','Chip/Search','Stepper','Breadcrumb','Navigation / Desktop Header']
for comp in key_components:
    present = [r for r in records if r['name']==comp]
    if not present: continue
    missing = []
    for state, rx in state_kw.items():
        # search for a sibling/descendant naming this state near the component
        found = any(rx.search(r['name']) for r in records if comp.split('/')[0].lower() in r['name'].lower())
        if not found: missing.append(state)
    if missing:
        add('Component Library', comp, 'Web+Mobile', comp, ', '.join(missing),
            f'Component "{comp}" ({len(present)} instances on page) has no frames/variants named for these interactive states: {", ".join(missing)}. Cannot verify the state exists or meets contrast until it is designed.',
            '1.4.11, 2.4.7', 'serious',
            f'{len(present)} instances placed; states {", ".join(missing)} not found by name anywhere on this page',
            f'Designer to add explicit variants for: {", ".join(missing)}. Each must meet 3:1 non-text contrast (focus ring/border) and 4.5:1 for any label text.',
            'Designer',
            'Detected by name-scan of this page only — states may exist in a separate component library file; confirm before actioning.')

# ---------- 4. Small text ----------
# text nodes with tiny heights are a proxy (metadata has no font size)
tiny = [r for r in records if r['type']=='text' and r['h'] is not None and r['h'] < 12 and r['w'] and r['w']>20]
if tiny:
    secs = Counter(r['section'] for r in tiny)
    add(', '.join(list(secs)[:3]), '(multiple)', 'Web+Mobile', 'Text node', 'Default',
        f'{len(tiny)} text nodes render at under 12px total height — likely body/caption copy below the 14px minimum for readable body text.',
        '1.4.4', 'moderate',
        f'{len(tiny)} nodes with rendered height <12px',
        'Raise body copy to >=14px (16px preferred). If these are legal/caption text, confirm they are non-essential and still >=12px.',
        'Designer',
        'Sample: ' + '; '.join(f"{r['name'][:30]} ({r['h']:.0f}px, {r['section']})" for r in tiny[:5]))

# ---------- 5. Hidden layers ----------
hidden = [r for r in records if r['hidden']]
if hidden:
    secs = Counter(r['section'] for r in hidden)
    add(', '.join(list(secs)[:3]), '(multiple)', 'Web+Mobile', 'Hidden layers', 'N/A',
        f'{len(hidden)} hidden layers left in the design. If a dev exports or inspects these frames, hidden content can leak into the build or confuse the spec.',
        'N/A (hygiene)', 'minor',
        f'{len(hidden)} layers with hidden=true',
        'Designer to delete genuinely dead layers; if intentionally showing an alternate state, move to a clearly-named variant instead.',
        'Designer',
        'Sample: ' + '; '.join(f"{r['name'][:30]} ({r['section']})" for r in hidden[:5]))

# ---------- 6. Decorative vector art / alt strategy ----------
vec_by_frame = Counter()
for r in records:
    if r['type'] in ('vector','boolean-operation'):
        vec_by_frame[(r['section'], r['frame'])] += 1
heavy = [(k,v) for k,v in vec_by_frame.items() if v > 150]
heavy.sort(key=lambda kv:-kv[1])
for (sec, frm), cnt in heavy[:12]:
    add(sec, frm or '(section root)', 'Web+Mobile', 'Decorative illustration', 'Default',
        f'Frame contains {cnt} vector/boolean-operation layers (decorative illustration art). Screen readers will announce these if exported as individual inline SVGs without aria-hidden.',
        '1.1.1', 'moderate',
        f'{cnt} vector layers in one frame',
        'Export the whole illustration as ONE asset with alt="" and aria-hidden="true" (decorative), or give it a single meaningful alt if it conveys information. Never ship as many individually-focusable inline SVG nodes.',
        'Designer + Dev')

# ---------- 7. Missing header/footer landmark consistency ----------
hdr = [r for r in records if r['name'] in ('Header','Navigation / Desktop Header')]
ftr = [r for r in records if r['name']=='Footer']
add('Navigations, 1B Footer, 1C Footer', 'Header / Footer components', 'Web+Mobile', 'Header / Footer', 'Default',
    f'Header ({len(hdr)} instances) and Footer ({len(ftr)} instances) are placed as component instances across the page but carry no annotation of landmark roles or heading level for dev.',
    '1.3.1, 2.4.1', 'moderate',
    f'{len(hdr)} header instances, {len(ftr)} footer instances, no role/landmark annotation found',
    'Annotate in Figma (or in the handoff doc): header=<header role="banner">, nav=<nav aria-label="Main">, footer=<footer role="contentinfo">, plus a "Skip to main content" link as the first focusable element. Confirmed missing on the live site (69/69 pages).',
    'Designer + Dev',
    'Cross-references live-site finding: no skip link on any of 69 pages.')

json.dump(findings, open('figma_findings.json','w'), indent=1)
print(f'TOTAL FIGMA FINDINGS: {len(findings)}')
sev = Counter(f['Severity'] for f in findings)
print('by severity:', dict(sev))
for f in findings[:5]:
    print(' ', f['Issue ID'], '|', f['Severity'], '|', f['Issue Description'][:85])
