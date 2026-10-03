#!/usr/bin/env python3
"""Render a phase spec JSON (same spec fed to Figma) into markdown files.
usage: render.py spec.json  -> writes {outdir}/{file}.md per board that has "file"
spec: {"out":"P2/02-define","boards":[{"file":"personas.md","title":..,"purpose":..,"blocks":[..]}]}"""
import json,sys,os
def cell(x): return str(x).replace('|','/').replace('\n',' ')
def blk(k):
    t=k['t'];o=[]
    if t=='text': o.append(k['s'])
    elif t=='bullets': o+=['- '+i for i in k['items']]
    elif t=='table':
        o.append('| '+' | '.join(map(cell,k['head']))+' |');o.append('|'+'---|'*len(k['head']))
        o+=['| '+' | '.join(map(cell,r))+' |' for r in k['rows']]
    elif t=='bars': o+=[f'- {a}: {b}/{c}' for a,b,c in k['items']]
    elif t=='cards':
        for i in k['items']:
            o.append(f"**{i['h']}**");b=i.get('b','')
            o+=(['- '+x for x in b] if isinstance(b,list) else [b]);o.append('')
    elif t=='journey':
        o.append('| |'+'|'.join(k['stages'])+'|');o.append('|---|'+'---|'*len(k['stages']))
        for n,c in k['rows']: o.append(f'| {n} |'+'|'.join(map(cell,c))+'|')
        o.append('| Emotion (1-5) |'+'|'.join(map(str,k['emotion']))+'|')
    elif t=='lanes':
        o.append('| |'+'|'.join(k['cols'])+'|');o.append('|---|'+'---|'*len(k['cols']))
        for l in k['lanes']:
            if l=='LOV': o.append('| **line of visibility** |'+'|'*len(k['cols']));continue
            o.append(f'| {l[0]} |'+'|'.join(map(cell,l[1]))+'|')
    elif t=='tree':
        def w(n,d):
            o.append('  '*d+'- '+n['l'])
            for c in n.get('c',[]): w(c,d+1)
        w(k['root'],0)
    elif t=='flow':
        names={n['id']:n['l'] for n in k['nodes']}
        o.append('```mermaid');o.append('flowchart LR')
        for n in k['nodes']:
            l=n['l'].replace('"',"'")
            o.append(f"  {n['id']}{{\"{l}\"}}" if n.get('k')=='decision' else f"  {n['id']}[\"{l}\"]")
        for e in k['edges']:
            o.append(f"  {e[0]} -->{'|'+e[2]+'|' if len(e)>2 else ''} {e[1]}")
        o.append('```')
    elif t=='map':
        o.append('Centre: '+k['center']);o+=['- '+n for n in k['nodes']]
    elif t=='quad':
        o.append('Quadrants: '+' | '.join(k.get('labels',[])))
        for i in k['items']: o.append(f'- {i[0]} (x{i[1]}, y{i[2]})')
    elif t=='screens':
        for s in k['items']: o.append(f"- **{s['n']}**: {s.get('a','')}")
    return '\n'.join(o)
spec=json.load(open(sys.argv[1]));os.makedirs(spec['out'],exist_ok=True)
files={}
for b in spec['boards']:
    f=b.get('file')
    if not f: continue
    s=files.setdefault(f,'')
    s+=f"## {b['title']}\n_{b.get('purpose','')}_ [{b.get('status','')}]\n\n"+'\n\n'.join(blk(k) for k in b['blocks'])+'\n\n'
    files[f]=s
for f,s in files.items():
    open(os.path.join(spec['out'],f),'w').write(f"# {spec['title']}\n\n"+s)
print(list(files))
