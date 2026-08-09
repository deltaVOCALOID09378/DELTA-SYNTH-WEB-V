import os
import re

html_dir = r"A:\Program Developing\DELTA_SYNTH-main\src\public\singers"

replacements = {
    "mochiai.html": (r"mochiai\.webp", "shiroino-mochi.webp"),
    "chansamorn.html": (r"chansamorn\.webp", "charnsamorn.webp"),
    "arun_kamonlanetr.html": (r"arun-kamonlanetr\.webp", "arun-kamonlanert.webp"),
    "kikakowa_usagi.html": (r"kikakowa-usagi\.webp", "kikokawa-usagi.webp")
}

for filename, (pattern, new_img) in replacements.items():
    filepath = os.path.join(html_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = re.sub(pattern, new_img, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filename}")
    else:
        print(f"{filename} not found")
