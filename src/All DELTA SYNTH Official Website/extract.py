import os
import re
import shutil
import hashlib

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
        match = re.search(re.escape(char), html_content, re.IGNORECASE)
        if match:
            start_idx = match.start()
            
            next_idx = start_idx + 15000
            for other_char in characters:
                if other_char == char: continue
                other_match = re.search(re.escape(other_char), html_content[start_idx+20:], re.IGNORECASE)
                if other_match:
                    found_idx = start_idx + 20 + other_match.start()
                    if found_idx < next_idx:
                        next_idx = found_idx
                        
            chunk = html_content[start_idx:next_idx]
            
            age_m = re.search(r"Age\s*:\s*([^<]+)", chunk, re.IGNORECASE)
            if age_m: char_data['age'] = age_m.group(1).strip()
            
            gender_m = re.search(r"Gender\s*:\s*([^<]+)", chunk, re.IGNORECASE)
            if gender_m: char_data['gender'] = gender_m.group(1).strip()
            
            voicer_m = re.search(r"Voicer\s*:\s*([^<]+)", chunk, re.IGNORECASE)
            if voicer_m: char_data['voicer'] = voicer_m.group(1).strip()
            
            genre_m = re.search(r"Genre\s*:\s*([^<]+)", chunk, re.IGNORECASE)
            if genre_m: char_data['genre'] = genre_m.group(1).strip()
            
            # Extract links
            link_matches = re.findall(r'<a[^>]+href="([^"]+)"[^>]*aria-label="([^"]+)"', chunk, re.IGNORECASE)
            # Remove duplicates while preserving order
            seen = set()
            for href, label in link_matches:
                if label not in seen and href != "#":
                    char_data['links'].append({'url': href, 'label': label})
                    seen.add(label)
                    
        data.append(char_data)
    return data

def find_image(char_name, src_dir):
    if not os.path.exists(src_dir):
        return None, None
        
    exact_path = os.path.join(src_dir, f"{char_name}.png")
    if os.path.exists(exact_path):
        return f"{char_name}.png", exact_path
        
    search_name = char_name.replace(" ", "").lower()
    for filename in os.listdir(src_dir):
        if filename.endswith(".png"):
            file_base = filename[:-4].replace(" ", "").lower()
            if search_name == file_base or search_name in file_base:
                return filename, os.path.join(src_dir, filename)
    return None, None

def get_color_theme(name):
    themes = [
        ("bg-pink-900", "text-pink-300", "border-pink-500", "from-pink-900 to-slate-900"),
        ("bg-blue-900", "text-blue-300", "border-blue-500", "from-blue-900 to-slate-900"),
        ("bg-green-900", "text-green-300", "border-green-500", "from-green-900 to-slate-900"),
        ("bg-purple-900", "text-purple-300", "border-purple-500", "from-purple-900 to-slate-900"),
        ("bg-red-900", "text-red-300", "border-red-500", "from-red-900 to-slate-900"),
        ("bg-yellow-900", "text-yellow-300", "border-yellow-500", "from-yellow-900 to-slate-900"),
        ("bg-indigo-900", "text-indigo-300", "border-indigo-500", "from-indigo-900 to-slate-900"),
    ]
    hash_val = int(hashlib.md5(name.encode('utf-8')).hexdigest(), 16)
    return themes[hash_val % len(themes)]

def generate_singer_page(char, char_filename, navbar, footer, src_dir):
    bg_col, txt_col, border_col, grad = get_color_theme(char['name'])
    
    # Re-path the navbar and footer links so they work from /singers/
    local_navbar = navbar.replace('href="', 'href="../').replace('href="../#', 'href="#').replace('src="', 'src="../')
    local_footer = footer.replace('href="', 'href="../').replace('href="../#', 'href="#').replace('src="', 'src="../')
    
    download_buttons_html = ""
    if char['links']:
        for i, link in enumerate(char['links']):
            color_cls = f"{bg_col} hover:opacity-80" if i == 0 else "bg-gray-700 hover:bg-gray-600"
            download_buttons_html += f'''
                            <a href="{link['url']}" target="_blank" class="{color_cls} text-white font-medium py-3 px-6 rounded-lg transition shadow-lg w-full md:w-auto text-center flex-1">
                                Download {link['label']}
                            </a>'''
    else:
        download_buttons_html = '''
                            <p class="text-gray-500 italic w-full text-center py-4">No downloads available yet (กำลังเตรียมไฟล์ดาวน์โหลด...)</p>'''
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{char['name']} - รายละเอียด (Details)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="bg-slate-900 text-gray-200 flex flex-col min-h-screen">
    {{local_navbar}}
    
    <main class="flex-grow pt-24 pb-16 bg-gradient-to-br {grad}">
        <div class="max-w-6xl mx-auto px-4">
            
            <div class="flex flex-col md:flex-row gap-8 bg-gray-900/80 p-8 rounded-2xl shadow-2xl border {border_col}">
                <!-- Image Section -->
                <div class="w-full md:w-1/3">
                    <div class="rounded-xl overflow-hidden shadow-lg border-2 {border_col}">
                        <img src="../{char['image_path']}" alt="{char['name']}" class="w-full h-auto object-cover object-top hover:scale-105 transition-transform duration-500">
                    </div>
                </div>
                
                <!-- Details Section -->
                <div class="w-full md:w-2/3 flex flex-col">
                    <h1 class="text-5xl font-extrabold text-white mb-2">{char['name']}</h1>
                    <h2 class="text-xl {txt_col} font-semibold mb-6">DELTA SYNTH Official Artist</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="bg-black/40 p-4 rounded-lg">
                            <h3 class="text-gray-400 text-sm uppercase tracking-wider mb-1">Voicer (ผู้ให้เสียง)</h3>
                            <p class="text-lg text-white font-medium">{char['voicer']}</p>
                        </div>
                        <div class="bg-black/40 p-4 rounded-lg">
                            <h3 class="text-gray-400 text-sm uppercase tracking-wider mb-1">Release Date (วันเปิดตัว)</h3>
                            <p class="text-lg text-white font-medium">2025</p>
                        </div>
                        <div class="bg-black/40 p-4 rounded-lg">
                            <h3 class="text-gray-400 text-sm uppercase tracking-wider mb-1">Age & Gender</h3>
                            <p class="text-lg text-white font-medium">{char['age']}, {char['gender']}</p>
                        </div>
                        <div class="bg-black/40 p-4 rounded-lg">
                            <h3 class="text-gray-400 text-sm uppercase tracking-wider mb-1">Genre (แนวเพลงที่เข้ากับสไตล์)</h3>
                            <p class="text-lg text-white font-medium">{char['genre']}</p>
                        </div>
                    </div>

                    <!-- Biography & Projects -->
                    <div class="mb-8">
                        <h3 class="text-2xl font-bold text-white mb-3 border-b border-gray-700 pb-2">Biography (ประวัติ)</h3>
                        <p class="text-gray-300 leading-relaxed mb-4">
                            {char['name']} is a featured singer in the DELTA SYNTH roster. Known for a unique vocal style matching {char['genre']}, they bring passion and depth to every track.
                            (ประวัติอย่างละเอียดจะถูกเพิ่มในภายหลัง)
                        </p>
                        
                        <h3 class="text-2xl font-bold text-white mb-3 border-b border-gray-700 pb-2">Projects (โปรเจกต์ที่สร้าง)</h3>
                        <ul class="list-disc list-inside text-gray-300 mb-4">
                            <li>Official Voicebank Release 2025</li>
                            <li>Collab with Printmov Team</li>
                        </ul>
                    </div>

                    <!-- Vocal Samples & Songs -->
                    <div class="mb-8">
                        <h3 class="text-2xl font-bold text-white mb-3 border-b border-gray-700 pb-2">Vocal Samples & Songs (ตัวอย่างเสียงและเพลงที่ร้อง)</h3>
                        <div class="bg-black/50 p-4 rounded-xl flex items-center justify-between mb-3 border border-gray-700 hover:{border_col} transition">
                            <div>
                                <h4 class="text-white font-medium">Sample Song 1</h4>
                                <p class="text-sm text-gray-400">Thai VCCV / Japanese VCV</p>
                            </div>
                            <button class="{bg_col} hover:bg-opacity-80 text-white px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2">
                                ▶ Play
                            </button>
                        </div>
                    </div>

                    <!-- Voice Details & Download -->
                    <div class="mt-auto bg-black/40 p-6 rounded-xl border border-gray-700">
                        <h3 class="text-2xl font-bold text-white mb-4">Voicebank Downloads (ไฟล์คลังเสียง)</h3>
                        <p class="text-gray-400 text-sm mb-4">Specific voice details: Clear, resonant, and dynamic across multiple languages.</p>
                        <div class="flex flex-wrap gap-3">
{download_buttons_html}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </main>
    
    {{local_footer}}
    
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
    
    html = html.replace('{local_navbar}', local_navbar).replace('{local_footer}', local_footer)
    
    filepath = os.path.join(src_dir, 'singers', char_filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

def main():
    base_dir = r"f:\All DELTA SYNTH Official Website"
    src_dir = os.path.join(base_dir, "src")
    
    vb_file = os.path.join(base_dir, "3._All Voicebank _ DELTA SYNTH.html")
    collab_file = os.path.join(base_dir, "5._All Callaboraion Voicebank. _ deltasynthstudio.html")
    
    with open(vb_file, 'r', encoding='utf-8', errors='ignore') as f:
        vb_html = f.read()
        
    with open(collab_file, 'r', encoding='utf-8', errors='ignore') as f:
        collab_html = f.read()
        
    vb_chars = ["Ahctan", "Arun Kamonlanetr", "Ayanami Hikaru", "Ayanami Kyoko", "Azaya Aika", "Chansamorn", "Diwachi", "Dokya", "FangYu", "FellowWhite", "Fuwari Bento", "Guren Kani", "Helen", "KangFu", "Kochujang", "Mairu Maishi", "Mayuree", "Miro", "Namphueng", "Narisa", "Onika", "Root", "SRIPHAN", "SUN", "Sakultala", "Savanna", "Thitiya Anantanetr", "Tom", "Yamada Takeshi"]
    collab_chars = ["Felix", "MochiAI", "Quint"]
    
    vb_data = extract_data(vb_html, vb_chars)
    collab_data = extract_data(collab_html, collab_chars)
    
    vb_img_dir = os.path.join(src_dir, "assets", "images", "voicebanks")
    collab_img_dir = os.path.join(src_dir, "assets", "images", "collabs")
    
    os.makedirs(vb_img_dir, exist_ok=True)
    os.makedirs(collab_img_dir, exist_ok=True)
    
    vb_src_img_dir = os.path.join(base_dir, "3._All Voicebank _ DELTA SYNTH_files")
    collab_src_img_dir = os.path.join(base_dir, "5._All Callaboraion Voicebank. _ deltasynthstudio_files")
    
    for char_dict in vb_data:
        char = char_dict['name']
        img_name, src_path = find_image(char, vb_src_img_dir)
        if src_path:
            dest_path = os.path.join(vb_img_dir, img_name)
            shutil.copy(src_path, dest_path)
            char_dict['image_path'] = f"assets/images/voicebanks/{img_name}"
        else:
            char_dict['image_path'] = "assets/images/placeholder.png"
            
    for char_dict in collab_data:
        char = char_dict['name']
        img_name, src_path = find_image(char, collab_src_img_dir)
        if src_path:
            dest_path = os.path.join(collab_img_dir, img_name)
            shutil.copy(src_path, dest_path)
            char_dict['image_path'] = f"assets/images/collabs/{img_name}"
        else:
            char_dict['image_path'] = "assets/images/placeholder.png"
            
    with open(os.path.join(src_dir, "index.html"), 'r', encoding='utf-8') as f:
        index_html = f.read()
        
    navbar_match = re.search(r'(<!-- Navbar -->.*?)</nav>', index_html, re.DOTALL)
    navbar = navbar_match.group(1) + '</nav>' if navbar_match else ''
    
    footer_match = re.search(r'(<!-- Footer -->.*?</footer>)', index_html, re.DOTALL)
    footer = footer_match.group(1) if footer_match else ''
    
    def generate_html(title, data):
        cards_html = ""
        for char in data:
            char_filename = char['name'].replace(' ', '_').lower() + '.html'
            
            # Generate the individual singer page
            generate_singer_page(char, char_filename, navbar, footer, src_dir)
            
            cards_html += f'''
            <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col transition hover:border-blue-500 hover:-translate-y-1 hover:shadow-2xl duration-300">
                <a href="singers/{char_filename}">
                    <img src="{char['image_path']}" alt="{char['name']}" class="w-full h-64 object-cover object-top transition-transform duration-500 hover:scale-105">
                </a>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-2xl font-bold text-white mb-2">{char['name']}</h3>
                    <ul class="text-sm text-gray-400 space-y-1 mb-4 flex-grow">
                        <li><span class="font-semibold text-gray-300">Age:</span> {char['age']}</li>
                        <li><span class="font-semibold text-gray-300">Gender:</span> {char['gender']}</li>
                        <li><span class="font-semibold text-gray-300">Voicer:</span> {char['voicer']}</li>
                        <li><span class="font-semibold text-gray-300">Genre:</span> {char['genre']}</li>
                    </ul>
                    <div class="space-y-2 mt-auto">
                        <!-- Changed "Thai VCCV" or "Download" to "รายละเอียด" -->
                        <a href="singers/{char_filename}" class="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98]">รายละเอียด</a>
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
        f.write(generate_html("All Voicebanks", vb_data))
        
    with open(os.path.join(src_dir, "collab.html"), 'w', encoding='utf-8') as f:
        f.write(generate_html("Collaboration Voicebanks", collab_data))
        
    print("Generation complete.")

if __name__ == "__main__":
    main()
