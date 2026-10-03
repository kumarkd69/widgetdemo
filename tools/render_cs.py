#!/usr/bin/env python3
"""case-study spec -> case-study.md, captions.md, interview-qna.md, pitch-60s.md
spec: {"out":..,"title":..,"outcome":..,"sections":[{"h","p":[],"b":[],"frames":[],"table":{"head","rows"}}],"captions":[],"qna":[[q,a]],"pitch":"","outline":[]}"""
import json,sys,os
s=json.load(open(sys.argv[1]));o=s['out'];os.makedirs(o,exist_ok=True)
m=[f"# {s['title']}\n",f"**{s['outcome']}**\n"]
for x in s['sections']:
    m.append(f"## {x['h']}")
    m+=x.get('p',[])
    m+=['- '+b for b in x.get('b',[])]
    t=x.get('table')
    if t:
        m.append('| '+' | '.join(t['head'])+' |');m.append('|'+'---|'*len(t['head']))
        m+=['| '+' | '.join(r)+' |' for r in t['rows']]
    if x.get('frames'): m.append('_Figma frames: '+', '.join(x['frames'])+'_')
    m.append('')
open(f'{o}/case-study.md','w').write('\n'.join(m))
open(f'{o}/captions.md','w').write('# Captions\n\n'+'\n'.join('- '+c for c in s['captions'])+'\n')
open(f'{o}/interview-qna.md','w').write('# 12 tough questions\n\n'+'\n\n'.join(f'**Q{i+1}. {q}**\n{a}' for i,(q,a) in enumerate(s['qna']))+'\n')
open(f'{o}/pitch-60s.md','w').write('# 60-second pitch\n\n'+s['pitch']+'\n\n# 10-minute outline\n\n'+'\n'.join(f'{i+1}. {l}' for i,l in enumerate(s['outline']))+'\n')
