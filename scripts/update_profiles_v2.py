import os
import re

singers_dir = r"A:\Program Developing\DELTA_SYNTH-main\src\public\singers"
voicebank_html = r"A:\Program Developing\DELTA_SYNTH-main\src\public\voicebank.html"

def kebab_case(s):
    # simple kebab case, removing spaces and making lowercase
    return s.strip().lower().replace(" ", "-")

def process_singer_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix image source and class for layout
    # Match something like src="../assets/images/voicebanks/Ayanami Hikaru.png"
    img_pattern = re.compile(r'<img\s+alt="([^"]+)"\s+class="([^"]*singer-image[^"]*)"\s+src="\.\./assets/images/voicebanks/[^"]+\.png"\s*/>')
    
    def img_repl(m):
        name = m.group(1)
        classes = m.group(2)
        # Add layout classes
        new_classes = classes.replace('hover:scale-[1.02]', 'hover:scale-[1.05] max-h-[80vh]')
        if 'max-h-[80vh]' not in new_classes:
            new_classes += ' max-h-[80vh]'
        kebab_name = kebab_case(name)
        return f'<img alt="{name}" class="{new_classes}" src="../assets/voicebanks/profile/{kebab_name}.webp" style="object-position: center;"/>'

    content = img_pattern.sub(img_repl, content)

    # 2. Fix layout container for image
    container_pattern = re.compile(r'<div class="relative w-full max-w-md">')
    content = container_pattern.sub('<div class="relative w-full max-w-lg lg:max-w-2xl flex justify-center items-center">', content)

    # 3. Remove bad file:///G: block if it exists
    bad_block_pattern = re.compile(r'<div class="mt-8 border-t border-gray-800/50 pt-8 text-center">\s*<h3 class="text-xl font-bold text-red-400 mb-4 font-th glow-text">ดาวน์โหลดคลังเสียง / Voicebanks</h3>\s*<div class="flex flex-col gap-3 items-center">.*?</div>\s*</div>', re.DOTALL)
    content = bad_block_pattern.sub('', content)

    # 4. Update download link to use GDrive
    gdrive_link = "https://drive.google.com/drive/u/0/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx"
    btn_pattern = re.compile(r'href="[^"]*"\s*>ดาวน์โหลด (.*?) \(Download\)</a>')
    
    def btn_repl(m):
        name = m.group(1)
        return f'href="{gdrive_link}" target="_blank" rel="noopener noreferrer">ดาวน์โหลด {name} (Download Voicebanks)</a>'
    
    content = btn_pattern.sub(btn_repl, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def process_voicebank_html():
    if not os.path.exists(voicebank_html):
        print(f"File not found: {voicebank_html}")
        return
        
    with open(voicebank_html, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match src="assets/images/voicebanks/Name.png"
    img_pattern = re.compile(r'src="assets/images/voicebanks/([^"]+)\.png"')
    
    def img_repl(m):
        name = m.group(1)
        kebab_name = kebab_case(name)
        return f'src="assets/voicebanks/profile/{kebab_name}.webp"'

    content = img_pattern.sub(img_repl, content)

    with open(voicebank_html, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("Processing singer profiles...")
    for filename in os.listdir(singers_dir):
        if filename.endswith(".html"):
            process_singer_html(os.path.join(singers_dir, filename))
            
    print("Processing main voicebank page...")
    process_voicebank_html()
    print("Done!")

if __name__ == "__main__":
    main()
