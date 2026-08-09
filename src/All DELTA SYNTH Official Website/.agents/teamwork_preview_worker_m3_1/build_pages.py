import os
import re
import shutil
import glob

def extract_data(html_content, characters):
    data = []
    for char in characters:
        char_data = {
            'name': char,
            'age': 'Unknown',
            'gender': 'Unknown',
            'voicer': 'DELTA SYNTH',
            'genre': 'Pop',
            'links': []
        }
        
        # Heuristic search
        pattern = re.compile(rf"{char}.*?(Age\s*:\s*([^<]+)).*?(Gender\s*:\s*([^<]+)).*?(Voicer\s*:\s*([^<]+)).*?(Genre\s*:\s*([^<]+))", re.IGNORECASE | re.DOTALL)
        match = pattern.search(html_content)
        if match:
            char_data['age'] = match.group(2).strip()
            char_data['gender'] = match.group(4).strip()
            char_data['voicer'] = match.group(6).strip()
            char_data['genre'] = match.group(8).strip()
            
        data.append(char_data)
    return data

def find_image(char, base_dir, fallback_dir):
    # Potential file names
    # Note: Sometimes there's a space or slight typo in file names, e.g., "Achtan" vs "Ahctan"
    # But let's try direct matches first, and case insensitive if possible.
    paths_to_check = [
        os.path.join(base_dir, "Picture File", "A Full Body Picture", f"{char}.png"),
        os.path.join(base_dir, "Picture File", "A Profile for Singer Picture", f"{char}.png"),
        os.path.join(base_dir, "Picture File", "A Full Body Picture", f"{char} .png"),
        os.path.join(base_dir, "Picture File", "A Profile for Singer Picture", f"{char} .png"),
        os.path.join(fallback_dir, f"{char}.png")
    ]
    
    for path in paths_to_check:
        if os.path.exists(path):
            return path
            
    # Try case-insensitive or loose match in the directories
    dirs_to_search = [
        os.path.join(base_dir, "Picture File", "A Full Body Picture"),
        os.path.join(base_dir, "Picture File", "A Profile for Singer Picture")
    ]
    for d in dirs_to_search:
        if os.path.exists(d):
            for file in os.listdir(d):
                if file.lower().startswith(char.lower()) and file.lower().endswith(".png"):
                    return os.path.join(d, file)
                    
    return None

def main():
    base_dir = r"e:\All DELTA SYNTH Official Website"
    src_dir = os.path.join(base_dir, "src")
    
    # 1. Read files
    vb_file = os.path.join(base_dir, "3._All Voicebank _ DELTA SYNTH.html")
    collab_file = os.path.join(base_dir, "5._All Callaboraion Voicebank. _ deltasynthstudio.html")
    
    with open(vb_file, 'r', encoding='utf-8', errors='ignore') as f:
        vb_html = f.read()
        
    with open(collab_file, 'r', encoding='utf-8', errors='ignore') as f:
        collab_html = f.read()
        
    # 2. Extract data
    vb_chars = ["Ahctan", "Arun Kamonlanetr", "Ayanami Hikaru", "Ayanami Kyoko", "Azaya Aika", "Chansamorn", "Diwachi", "Dokya", "FangYu", "FellowWhite", "Fuwari Bento", "Guren Kani", "Helen", "KangFu", "Kochujang", "Mairu Maishi", "Mayuree", "Miro", "Namphueng", "Narisa", "Onika", "Root", "SRIPHAN", "SUN", "Sakultala", "Savanna", "Thitiya Anantanetr", "Tom", "Yamada Takeshi"]
    collab_chars = ["Felix", "MochiAI", "Quint"]
    
    vb_data = extract_data(vb_html, vb_chars)
    collab_data = extract_data(collab_html, collab_chars)
    
    # 3. Create directories and copy images
    vb_img_dir = os.path.join(src_dir, "assets", "images", "voicebanks")
    collab_img_dir = os.path.join(src_dir, "assets", "images", "collabs")
    
    os.makedirs(vb_img_dir, exist_ok=True)
    os.makedirs(collab_img_dir, exist_ok=True)
    
    vb_fallback = os.path.join(base_dir, "3._All Voicebank _ DELTA SYNTH_files")
    collab_fallback = os.path.join(base_dir, "5._All Callaboraion Voicebank. _ deltasynthstudio_files")
    
    for char in vb_chars:
        src_path = find_image(char, base_dir, vb_fallback)
        dest_path = os.path.join(vb_img_dir, f"{char}.png")
        if src_path:
            shutil.copy(src_path, dest_path)
        else:
            print(f"Warning: Image not found for {char}")
            
    for char in collab_chars:
        src_path = find_image(char, base_dir, collab_fallback)
        if not src_path and char == "MochiAI":
            # Loose match for MochiAI? Shiroino Mochi?
            src_path = find_image("Shiroino Mochi", base_dir, collab_fallback)
        dest_path = os.path.join(collab_img_dir, f"{char}.png")
        if src_path:
            shutil.copy(src_path, dest_path)
        else:
            print(f"Warning: Image not found for {char}")
            
    # 4. Generate HTML
    with open(os.path.join(src_dir, "index.html"), 'r', encoding='utf-8') as f:
        index_html = f.read()
        
    # Extract navbar and footer
    navbar_match = re.search(r'(<!-- Navbar -->.*?)</nav>', index_html, re.DOTALL)
    navbar = navbar_match.group(1) + '</nav>' if navbar_match else ''
    
    footer_match = re.search(r'(<!-- Footer -->.*?</footer>)', index_html, re.DOTALL)
    footer = footer_match.group(1) if footer_match else ''
    
    def generate_html(title, data, img_path_prefix):
        cards_html = ""
        for char in data:
            cards_html += f'''
            <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col transition hover:border-blue-500">
                <img src="{img_path_prefix}{char['name']}.png" alt="{char['name']}" class="w-full h-64 object-cover object-top">
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-2xl font-bold text-white mb-2">{char['name']}</h3>
                    <ul class="text-sm text-gray-400 space-y-1 mb-4 flex-grow">
                        <li><span class="font-semibold text-gray-300">Age:</span> {char['age']}</li>
                        <li><span class="font-semibold text-gray-300">Gender:</span> {char['gender']}</li>
                        <li><span class="font-semibold text-gray-300">Voicer:</span> {char['voicer']}</li>
                        <li><span class="font-semibold text-gray-300">Genre:</span> {char['genre']}</li>
                    </ul>
                    <div class="space-y-2 mt-auto">
                        <a href="#" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">Download (See Details)</a>
                    </div>
                </div>
            </div>
            '''
            
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - DELTA SYNTH Studio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/styles.css">
    <style>
        body {{ font-family: sans-serif; }}
    </style>
</head>
<body class="bg-slate-900 text-gray-200 flex flex-col min-h-screen">
    {navbar}
    
    <main class="flex-grow pt-24 pb-16">
        <div class="max-w-7xl mx-auto px-4">
            <h1 class="text-4xl font-extrabold text-white mb-10 text-center">{title}</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {cards_html}
            </div>
        </div>
    </main>
    
    {footer}
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            const btn = document.getElementById('mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');

            if (btn && menu) {{
                btn.addEventListener('click', () => {{
                    menu.classList.toggle('hidden');
                }});
            }}
        }});
    </script>
</body>
</html>'''
        return html

    with open(os.path.join(src_dir, "voicebank.html"), 'w', encoding='utf-8') as f:
        f.write(generate_html("All Voicebanks", vb_data, "assets/images/voicebanks/"))
        
    with open(os.path.join(src_dir, "collab.html"), 'w', encoding='utf-8') as f:
        f.write(generate_html("Collaboration Voicebanks", collab_data, "assets/images/collabs/"))

if __name__ == "__main__":
    main()
