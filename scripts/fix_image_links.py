import os
import glob
import re

html_dir = r"A:\Program Developing\DELTA_SYNTH-main\src\public\singers"
img_dir = r"A:\Program Developing\DELTA_SYNTH-main\src\public\assets\voicebanks\profile"

html_files = glob.glob(os.path.join(html_dir, "*.html"))
img_files = [os.path.basename(f) for f in glob.glob(os.path.join(img_dir, "*.webp"))]

# Create a mapping from expected normalized name to actual webp filename
def normalize(name):
    return name.replace('_', '').replace('-', '').replace(' ', '').lower()

img_map = {normalize(f.replace('.webp', '')): f for f in img_files}

updated_count = 0
for file_path in html_files:
    filename = os.path.basename(file_path).replace('.html', '')
    norm_name = normalize(filename)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # We want to replace src="../assets/voicebanks/profile/..." with the correct one
    if norm_name in img_map:
        correct_img = img_map[norm_name]
        # Regex to find existing img src
        # It looks like: <img src="../assets/voicebanks/profile/ayanami_hikaru.webp"
        pattern = r'src="\.\./assets/voicebanks/profile/[^"]+\.webp"'
        replacement = f'src="../assets/voicebanks/profile/{correct_img}"'
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_count += 1
        print(f"Fixed image link in {filename}.html to {correct_img}")

print(f"Updated {updated_count} files with correct image links.")
