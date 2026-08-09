import os
import glob
import re

public_dir = r"A:\Program Developing\DELTA_SYNTH-main\src\public"

# We want to replace href="#" for specific navigation items
replacements = {
    r'href="#"([^>]*>)\s*Voicebanks\s*</a>': r'href="voicebank.html"\1Voicebanks</a>',
    r'href="#"([^>]*>)\s*Project\s*</a>': r'href="project.html"\1Project</a>',
    r'href="#"([^>]*>)\s*Home\s*</a>': r'href="index.html"\1Home</a>',
    r'href="#"([^>]*>)\s*About Us\s*</a>': r'href="about.html"\1About Us</a>'
}

for root, _, files in os.walk(public_dir):
    for filename in files:
        if filename.endswith(".html"):
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for pattern, replacement in replacements.items():
                # Some links might have class after href, or before.
                # Actually, the html is usually `<a href="#" class="...">Voicebanks</a>`
                # or `<a class="..." href="#">Voicebanks</a>`
                new_content = re.sub(pattern, replacement, new_content, flags=re.IGNORECASE)
            
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Fixed nav links in {filepath}")
