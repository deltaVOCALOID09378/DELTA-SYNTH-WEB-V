# Made And Checked By DELTA SYNTH & Gemini AI
# Original by Patiphat Wongyai
# v.1.1 [2026-06-29]

import os # นำเข้าโมดูล os เพื่อจัดการระบบไฟล์และเส้นทาง (Import os module for file and path management)
import re # นำเข้าโมดูล re เพื่อใช้งาน Regular Expression ในการค้นหาข้อความ (Import re module for text search)
import shutil # นำเข้าโมดูล shutil สำหรับการคัดลอกและจัดการไฟล์ภาพ (Import shutil module for image file copying)
import hashlib # นำเข้าโมดูล hashlib เพื่อสร้าง Hash สำหรับสุ่มสี UI (Import hashlib module for UI color generation)

def extract_data(html_content, characters): # ฟังก์ชันสกัดข้อมูลตัวละครจาก HTML ต้นฉบับ (Function to extract character data from raw HTML)
    data = [] # สร้างรายการว่างเพื่อจัดเก็บข้อมูล (Initialize empty list to store data)
    for char in characters: # วนลูปตามรายชื่อตัวละครทั้งหมด (Iterate through all character names)
        char_data = { # กำหนดโครงสร้างข้อมูลเริ่มต้น (Initialize default data structure)
            'name': char, # ระบุชื่อตัวละคร (Set character name)
            'age': '???', # หากไม่พบอายุให้ใส่ ??? (Set default age to ??? if missing)[cite: 1]
            'gender': '???', # หากไม่พบเพศให้ใส่ ??? (Set default gender to ??? if missing)[cite: 1]
            'voicer': 'DELTA SYNTH', # กำหนดผู้ให้เสียงเริ่มต้น (Set default voicer)
            'genre': '???', # หากไม่พบแนวเพลงให้ใส่ ??? (Set default genre to ??? if missing)[cite: 1]
            'links': [] # สร้างรายการว่างสำหรับลิงก์ดาวน์โหลด (Initialize empty list for download links)
        }
        match = re.search(re.escape(char), html_content, re.IGNORECASE) # ค้นหาชื่อตัวละครในเอกสาร (Search for character name in document)
        if match: # หากพบชื่อตัวละคร (If character name is found)
            start_idx = match.start() # กำหนดจุดเริ่มต้นการอ่านข้อมูล (Set starting index for data extraction)
            next_idx = start_idx + 15000 # กำหนดขอบเขตการอ่านข้อมูล (Set reading boundary)
            for other_char in characters: # วนลูปเพื่อหาตัวละครถัดไปเป็นจุดสิ้นสุด (Iterate to find the next character as endpoint)
                if other_char == char: continue # ข้ามหากเป็นชื่อเดียวกัน (Skip if it's the same name)
                other_match = re.search(re.escape(other_char), html_content[start_idx+20:], re.IGNORECASE) # ค้นหาตัวละครถัดไป (Search for next character)
                if other_match: # หากพบตัวละครถัดไป (If next character is found)
                    found_idx = start_idx + 20 + other_match.start() # กำหนดจุดพบ (Set found index)
                    if found_idx < next_idx: # หากอยู่ใกล้กว่าขอบเขตเดิม (If closer than current boundary)
                        next_idx = found_idx # อัปเดตจุดสิ้นสุดใหม่ (Update endpoint)
                        
            chunk = html_content[start_idx:next_idx] # ตัดข้อความเฉพาะส่วนของตัวละครนั้น (Slice text for specific character)
            
            age_m = re.search(r"Age\s*:\s*([^<]+)", chunk, re.IGNORECASE) # ค้นหาอายุ (Search for Age)
            if age_m and age_m.group(1).strip(): char_data['age'] = age_m.group(1).strip() # บันทึกอายุหากพบ (Save age if found)
            
            gender_m = re.search(r"Gender\s*:\s*([^<]+)", chunk, re.IGNORECASE) # ค้นหาเพศ (Search for Gender)
            if gender_m and gender_m.group(1).strip(): char_data['gender'] = gender_m.group(1).strip() # บันทึกเพศหากพบ (Save gender if found)
            
            voicer_m = re.search(r"Voicer\s*:\s*([^<]+)", chunk, re.IGNORECASE) # ค้นหาผู้ให้เสียง (Search for Voicer)
            if voicer_m and voicer_m.group(1).strip(): char_data['voicer'] = voicer_m.group(1).strip() # บันทึกผู้ให้เสียงหากพบ (Save voicer if found)
            
            genre_m = re.search(r"Genre\s*:\s*([^<]+)", chunk, re.IGNORECASE) # ค้นหาแนวเพลง (Search for Genre)
            if genre_m and genre_m.group(1).strip(): char_data['genre'] = genre_m.group(1).strip() # บันทึกแนวเพลงหากพบ (Save genre if found)
            
            link_matches = re.findall(r'<a[^>]+href="([^"]+)"[^>]*aria-label="([^"]+)"', chunk, re.IGNORECASE) # ค้นหาลิงก์ดาวน์โหลด (Search for download links)
            seen = set() # สร้างเซ็ตเพื่อป้องกันลิงก์ซ้ำ (Initialize set to prevent duplicate links)
            for href, label in link_matches: # วนลูปแยก URL และชื่อปุ่ม (Iterate URLs and button labels)
                if label not in seen and href != "#": # หากลิงก์ใช้งานได้และไม่ซ้ำ (If link is valid and unique)
                    char_data['links'].append({'url': href, 'label': label}) # เพิ่มเข้าสู่รายการ (Add to list)
                    seen.add(label) # บันทึกว่าพบแล้ว (Mark as seen)
                    
        data.append(char_data) # เพิ่มข้อมูลลงในรายการหลัก (Append to main data list)
    return data # ส่งคืนข้อมูลทั้งหมด (Return all data)

def find_image(char_name, src_dir): # ฟังก์ชันค้นหาไฟล์ภาพของตัวละคร (Function to find character image)
    if not os.path.exists(src_dir): # หากไม่มีโฟลเดอร์ต้นทาง (If source directory doesn't exist)
        return None, None # ส่งคืนค่าว่าง (Return None)
    exact_path = os.path.join(src_dir, f"{char_name}.png") # ตรวจสอบชื่อไฟล์ตรงตัว (Check exact filename match)
    if os.path.exists(exact_path): # หากพบไฟล์ (If file exists)
        return f"{char_name}.png", exact_path # ส่งคืนชื่อและเส้นทาง (Return filename and path)
    search_name = char_name.replace(" ", "").lower() # แปลงชื่อสำหรับค้นหาแบบยืดหยุ่น (Format name for flexible search)
    for filename in os.listdir(src_dir): # วนลูปค้นหาในโฟลเดอร์ (Iterate directory files)
        if filename.endswith(".png"): # ตรวจสอบเฉพาะไฟล์ PNG (Check only PNG files)
            file_base = filename[:-4].replace(" ", "").lower() # แปลงชื่อไฟล์ (Format filename)
            if search_name == file_base or search_name in file_base: # หากชื่อตรงกัน (If names match)
                return filename, os.path.join(src_dir, filename) # ส่งคืนข้อมูลไฟล์ (Return file data)
    return None, None # ส่งคืนค่าว่างหากไม่พบ (Return None if not found)

def get_color_theme(name): # ฟังก์ชันสุ่มธีมสีตามชื่อ (Function to generate color theme based on name)
    themes = [ # รายการธีมสีแบบ Tailwind CSS (List of Tailwind CSS themes)
        ("bg-pink-900", "text-pink-300", "border-pink-500", "from-pink-900 to-slate-900"), # ธีมสีชมพู (Pink theme)
        ("bg-blue-900", "text-blue-300", "border-blue-500", "from-blue-900 to-slate-900"), # ธีมสีน้ำเงิน (Blue theme)
        ("bg-green-900", "text-green-300", "border-green-500", "from-green-900 to-slate-900"), # ธีมสีเขียว (Green theme)
        ("bg-purple-900", "text-purple-300", "border-purple-500", "from-purple-900 to-slate-900"), # ธีมสีม่วง (Purple theme)
        ("bg-red-900", "text-red-300", "border-red-500", "from-red-900 to-slate-900"), # ธีมสีแดง (Red theme)
        ("bg-yellow-900", "text-yellow-300", "border-yellow-500", "from-yellow-900 to-slate-900"), # ธีมสีเหลือง (Yellow theme)
        ("bg-indigo-900", "text-indigo-300", "border-indigo-500", "from-indigo-900 to-slate-900"), # ธีมสีคราม (Indigo theme)
    ]
    hash_val = int(hashlib.md5(name.encode('utf-8')).hexdigest(), 16) # สร้างค่า Hash จากชื่อ (Generate Hash from name)
    return themes[hash_val % len(themes)] # ส่งคืนธีมสีที่ได้ (Return selected theme)

def generate_singer_page(char, char_filename, navbar, footer, src_dir): # ฟังก์ชันสร้างหน้าเว็บส่วนตัว (Function to generate profile page)
    bg_col, txt_col, border_col, grad = get_color_theme(char['name']) # รับค่าธีมสี (Apply color theme)
    local_navbar = navbar.replace('href="', 'href="../').replace('href="../#', 'href="#').replace('src="', 'src="../') # ปรับเส้นทาง Navbar (Adjust Navbar paths)
    local_footer = footer.replace('href="', 'href="../').replace('href="../#', 'href="#').replace('src="', 'src="../') # ปรับเส้นทาง Footer (Adjust Footer paths)
    
    download_buttons_html = "" # กำหนดตัวแปรสำหรับปุ่มดาวน์โหลด (Initialize download buttons)
    if char['links']: # หากมีลิงก์ (If links exist)
        for i, link in enumerate(char['links']): # วนลูปสร้างปุ่ม (Iterate to create buttons)
            color_cls = f"{bg_col} hover:opacity-80" if i == 0 else "bg-gray-700 hover:bg-gray-600" # สลับสีปุ่ม (Alternate button colors)
            download_buttons_html += f'''
                            <a href="{link['url']}" target="_blank" class="{color_cls} text-white font-medium py-3 px-6 rounded-lg transition shadow-lg w-full md:w-auto text-center flex-1">
                                ดาวน์โหลด / Download {link['label']}
                            </a>''' # โค้ด HTML ปุ่ม (HTML code for buttons)
    else: # หากไม่มีลิงก์ (If no links)
        download_buttons_html = '''
                            <p class="text-gray-500 italic w-full text-center py-4">ไฟล์กำลังเตรียมพร้อม (Preparing files for download...)</p>''' # ข้อความแสดงการรอไฟล์ (Waiting message)

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{char['name']} - รายละเอียด (Profile Details)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="bg-slate-900 text-gray-200 flex flex-col min-h-screen">
    {{local_navbar}}
    
    <main class="flex-grow pt-24 pb-16 bg-gradient-to-br {grad}">
        <div class="max-w-7xl mx-auto px-4">
            
            <div class="flex flex-col lg:flex-row gap-10 bg-gray-900/90 p-10 rounded-3xl shadow-2xl border {border_col}">
                
                <!-- Full Body Image Section -->
                <div class="w-full lg:w-2/5 flex flex-col items-center">
                    <div class="rounded-2xl overflow-hidden shadow-2xl border-4 {border_col} bg-black/50 relative w-full h-[600px] flex items-center justify-center">
                        <img src="../{char['image_path']}" alt="{char['name']}" class="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-700">
                    </div>
                    <p class="text-xs text-gray-400 mt-4 text-center italic px-4">
                        Made The Picture By Genini AI And Drawing Design By They're the Voicer Creater.
                    </p>
                </div>
                
                <!-- Details Section -->
                <div class="w-full lg:w-3/5 flex flex-col justify-center">
                    <div class="border-b border-gray-700 pb-6 mb-6">
                        <h1 class="text-6xl font-extrabold text-white mb-3 tracking-tight">{char['name']}</h1>
                        <h2 class="text-2xl {txt_col} font-semibold uppercase tracking-widest">DELTA SYNTH Official Artist</h2>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <div class="bg-black/60 p-5 rounded-xl border border-gray-800 hover:border-gray-600 transition">
                            <h3 class="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">ผู้ให้เสียง (Voicer)</h3>
                            <p class="text-xl text-white font-medium">{char['voicer']}</p>
                        </div>
                        <div class="bg-black/60 p-5 rounded-xl border border-gray-800 hover:border-gray-600 transition">
                            <h3 class="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">แนวเพลง (Genre)</h3>
                            <p class="text-xl text-white font-medium">{char['genre']}</p>
                        </div>
                        <div class="bg-black/60 p-5 rounded-xl border border-gray-800 hover:border-gray-600 transition">
                            <h3 class="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">อายุ (Age)</h3>
                            <p class="text-xl text-white font-medium">{char['age']}</p>
                        </div>
                        <div class="bg-black/60 p-5 rounded-xl border border-gray-800 hover:border-gray-600 transition">
                            <h3 class="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">เพศ (Gender)</h3>
                            <p class="text-xl text-white font-medium">{char['gender']}</p>
                        </div>
                    </div>

                    <!-- Biography Section -->
                    <div class="mb-10 bg-black/40 p-6 rounded-2xl border border-gray-800">
                        <h3 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <span class="{txt_col}">■</span> ประวัติและผลงาน (Biography & Projects)
                        </h3>
                        <p class="text-gray-300 leading-relaxed text-lg">
                            นักร้องคุณภาพจาก DELTA SYNTH Studio มีเอกลักษณ์เสียงที่โดดเด่นและเข้ากับสไตล์ {char['genre']} ได้อย่างลงตัว พร้อมมอบประสบการณ์การฟังเพลงที่ยอดเยี่ยมที่สุดให้กับคุณ <br><br>
                            <span class="text-sm text-gray-500">({char['name']} is a premium vocal talent from DELTA SYNTH Studio. Renowned for a unique vocal signature perfectly suited for {char['genre']}, delivering an unparalleled auditory experience.)</span>
                        </p>
                    </div>

                    <!-- Download Section -->
                    <div class="mt-auto bg-black/60 p-8 rounded-2xl border border-gray-700 shadow-inner">
                        <h3 class="text-3xl font-bold text-white mb-6">คลังเสียง (Voicebank Downloads)</h3>
                        <div class="flex flex-wrap gap-4">
{download_buttons_html}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </main>
    
    {{local_footer}}
    
</body>
</html>''' # โครงสร้างหน้าเว็บรูปแบบสมบูรณ์ (Complete HTML Structure)
    
    html = html.replace('{local_navbar}', local_navbar).replace('{local_footer}', local_footer) # ทำการแทนที่ตัวแปร UI (Replace UI variables)
    
    filepath = os.path.join(src_dir, 'singers', char_filename) # กำหนดเส้นทางจัดเก็บ (Set destination path)
    os.makedirs(os.path.dirname(filepath), exist_ok=True) # สร้างโฟลเดอร์หากไม่มี (Create directory if not exists)
    with open(filepath, 'w', encoding='utf-8') as f: # เปิดไฟล์สำหรับเขียน (Open file for writing)
        f.write(html) # บันทึกข้อมูลลงไฟล์ (Write data to file)

def main(): # ฟังก์ชันเริ่มการทำงานหลัก (Main execution function)
    base_dir = r"e:\All DELTA SYNTH Official Website" # กำหนดเส้นทางโปรเจกต์หลัก (Set main project directory)
    src_dir = os.path.join(base_dir, "src") # กำหนดเส้นทางข้อมูลต้นทาง (Set source directory)
    
    vb_file = os.path.join(base_dir, "3._All Voicebank _ DELTA SYNTH.html") # ไฟล์ Voicebank ต้นฉบับ (Original Voicebank file)
    collab_file = os.path.join(base_dir, "5._All Callaboraion Voicebank. _ deltasynthstudio.html") # ไฟล์ Collab ต้นฉบับ (Original Collab file)
    
    if os.path.exists(vb_file) and os.path.exists(collab_file): # ตรวจสอบการมีอยู่ของไฟล์ (Check file existence)
        with open(vb_file, 'r', encoding='utf-8', errors='ignore') as f: vb_html = f.read() # อ่านข้อมูลไฟล์ (Read file data)
        with open(collab_file, 'r', encoding='utf-8', errors='ignore') as f: collab_html = f.read() # อ่านข้อมูลไฟล์ (Read file data)
        
        # รายชื่อตัวละครอ้างอิงจากฐานข้อมูลกลาง (Character names referenced from central database)
        vb_chars = ["Ahctan", "Arun Kamonlanetr", "Ayanami Hikaru", "Ayanami Kyoko", "Azaya Aika", "Chansamorn", "Diwachi", "Dokya", "FangYu", "FellowWhite", "Fuwari Bento", "Guren Kani", "Helen", "KangFu", "Kochujang", "Mairu Maishi", "Mayuree", "Miro", "Namphueng", "Narisa", "Onika", "Root", "SRIPHAN", "SUN", "Sakultala", "Savanna", "Thitiya Anantanetr", "Tom", "Yamada Takeshi"]
        collab_chars = ["Felix", "MochiAI", "Quint"]
        
        vb_data = extract_data(vb_html, vb_chars) # ดึงข้อมูล Voicebank (Extract Voicebank data)
        collab_data = extract_data(collab_html, collab_chars) # ดึงข้อมูล Collab (Extract Collab data)
        
        vb_img_dir = os.path.join(src_dir, "assets", "images", "voicebanks") # โฟลเดอร์รูปภาพ (Image directory)
        collab_img_dir = os.path.join(src_dir, "assets", "images", "collabs") # โฟลเดอร์รูปภาพ (Image directory)
        
        os.makedirs(vb_img_dir, exist_ok=True) # ยืนยันการสร้างโฟลเดอร์ (Ensure directory exists)
        os.makedirs(collab_img_dir, exist_ok=True) # ยืนยันการสร้างโฟลเดอร์ (Ensure directory exists)
        
        vb_src_img_dir = os.path.join(base_dir, "3._All Voicebank _ DELTA SYNTH_files") # ต้นทางรูปภาพ (Image source path)
        collab_src_img_dir = os.path.join(base_dir, "5._All Callaboraion Voicebank. _ deltasynthstudio_files") # ต้นทางรูปภาพ (Image source path)
        
        for char_dict in vb_data + collab_data: # รวมรายการเพื่อประมวลผล (Merge lists for processing)
            src_img_dir = vb_src_img_dir if char_dict in vb_data else collab_src_img_dir # กำหนดที่อยู่ (Define location)
            dest_img_dir = vb_img_dir if char_dict in vb_data else collab_img_dir # กำหนดปลายทาง (Define destination)
            img_prefix = "voicebanks" if char_dict in vb_data else "collabs" # คำนำหน้าเส้นทาง (Path prefix)
            
            img_name, src_path = find_image(char_dict['name'], src_img_dir) # ค้นหาและจับคู่ภาพ (Find and match image)
            if src_path: # หากมีภาพ (If image found)
                shutil.copy(src_path, os.path.join(dest_img_dir, img_name)) # สำเนาภาพ (Copy image)
                char_dict['image_path'] = f"assets/images/{img_prefix}/{img_name}" # บันทึกเส้นทาง (Save path)
            else: # หากไม่พบ (If not found)
                char_dict['image_path'] = "assets/images/placeholder.png" # ใช้ภาพสำรอง (Use placeholder)
                
        idx_path = os.path.join(src_dir, "index.html") # ไฟล์สารบัญหลัก (Main index file)
        if os.path.exists(idx_path): # ตรวจสอบ (Verification)
            with open(idx_path, 'r', encoding='utf-8') as f: index_html = f.read() # อ่านข้อมูล (Read data)
            
            navbar_match = re.search(r'(<!-- Navbar -->.*?)</nav>', index_html, re.DOTALL) # หา Navbar (Find Navbar)
            navbar = navbar_match.group(1) + '</nav>' if navbar_match else '' # บันทึก Navbar (Save Navbar)
            
            footer_match = re.search(r'(<!-- Footer -->.*?</footer>)', index_html, re.DOTALL) # หา Footer (Find Footer)
            footer = footer_match.group(1) if footer_match else '' # บันทึก Footer (Save Footer)
            
            def generate_html(title, data): # สร้างหน้าเว็บสารบัญ (Generate Hub Page)
                cards_html = "" # บล็อกการ์ดว่าง (Empty card block)
                for char in data: # วนลูปตัวละคร (Iterate characters)
                    char_filename = char['name'].replace(' ', '_').lower() + '.html' # ชื่อไฟล์มาตรฐาน (Standard filename)
                    generate_singer_page(char, char_filename, navbar, footer, src_dir) # สร้างหน้าย่อย (Generate subpage)
                    
                    cards_html += f'''
                    <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700 flex flex-col transition-all hover:border-blue-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] duration-300">
                        <a href="singers/{char_filename}" class="relative group block overflow-hidden">
                            <div class="absolute inset-0 bg-blue-600/20 group-hover:opacity-0 transition-opacity duration-300 z-10"></div>
                            <img src="{char['image_path']}" alt="{char['name']}" class="w-full h-72 object-cover object-top transition-transform duration-700 group-hover:scale-110">
                        </a>
                        <div class="p-6 flex-grow flex flex-col bg-gradient-to-b from-gray-800 to-gray-900">
                            <h3 class="text-3xl font-bold text-white mb-4 text-center">{char['name']}</h3>
                            <div class="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-6 flex-grow">
                                <div class="bg-gray-800/50 p-2 rounded-lg border border-gray-700/50"><span class="block text-xs font-semibold text-gray-500 uppercase">Age</span> {char['age']}</div>
                                <div class="bg-gray-800/50 p-2 rounded-lg border border-gray-700/50"><span class="block text-xs font-semibold text-gray-500 uppercase">Gender</span> {char['gender']}</div>
                                <div class="bg-gray-800/50 p-2 rounded-lg border border-gray-700/50"><span class="block text-xs font-semibold text-gray-500 uppercase">Voicer</span> <span class="truncate block">{char['voicer']}</span></div>
                                <div class="bg-gray-800/50 p-2 rounded-lg border border-gray-700/50"><span class="block text-xs font-semibold text-gray-500 uppercase">Genre</span> <span class="truncate block">{char['genre']}</span></div>
                            </div>
                            <div class="mt-auto">
                                <a href="singers/{char_filename}" class="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    รายละเอียด (Details)
                                </a>
                            </div>
                        </div>
                    </div>
                    ''' # โครงสร้าง UI/UX ของการ์ด (UI/UX Structure of Card)
                    
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
    <main class="flex-grow pt-28 pb-20 bg-[url('assets/images/bg-pattern.svg')] bg-fixed">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-12 text-center uppercase tracking-tight">{title}</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {cards_html}
            </div>
        </div>
    </main>
    {footer}
</body>
</html>''' # โครงสร้างหน้าสรุปรวม (Summary Page Structure)
                return html # ส่งคืนรหัส HTML (Return HTML code)

            with open(os.path.join(src_dir, "voicebank.html"), 'w', encoding='utf-8') as f: f.write(generate_html("All Voicebanks", vb_data)) # เขียนหน้าคลังเสียง (Write voicebank page)
            with open(os.path.join(src_dir, "collab.html"), 'w', encoding='utf-8') as f: f.write(generate_html("Collaboration Voicebanks", collab_data)) # เขียนหน้าโคแลป (Write collab page)
            print("[System] Data extraction and page generation completed successfully.") # ยืนยันการเสร็จสิ้น (Confirm completion)

if __name__ == "__main__": # จุดเริ่มรันสคริปต์ (Execution entry point)
    main() # เรียกฟังก์ชันหลัก (Call main function)