import glob
import re
import os

html_files = glob.glob(r'A:\Program Developing\DELTA_SYNTH-main\src\public\singers\*.html')
missing = set()

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    hrefs = re.findall(r'href="([^"]+)"', content)
    for href in hrefs:
        if href.startswith('http') or href.startswith('#') or href.startswith('mailto:'):
            continue
        
        dir_path = os.path.dirname(file_path)
        target_path = os.path.normpath(os.path.join(dir_path, href))
        if not os.path.exists(target_path):
            missing.add(f'{os.path.basename(file_path)} -> {href} (resolved: {target_path})')

if missing:
    print('Broken links found:')
    for m in missing:
        print(m)
else:
    print('No broken links found!')
