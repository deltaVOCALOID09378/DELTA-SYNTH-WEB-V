import re
import os
import glob
import json

# 1. Parse content.md
content_path = r"C:\Users\patip\.gemini\antigravity\brain\6ab1b198-79b7-4d60-af74-3412717d28e3\.system_generated\steps\256\content.md"
with open(content_path, encoding='utf-8') as f:
    html = f.read()

text = re.sub(r'<[^>]+>', '\n', html)
text = re.sub(r'&nbsp;', ' ', text)
text = re.sub(r'&#39;', "'", text)
text = re.sub(r'\n+', '\n', text)
lines = [l.strip() for l in text.split('\n') if l.strip()]

singers = {}
current_singer = {}

for line in lines:
    if line.startswith('Name') and ':' in line:
        if current_singer and 'name' in current_singer:
            singers[current_singer['name'].lower()] = current_singer
        
        name_val = line.split(':', 1)[1].strip()
        # Clean up some messy names in Wix
        name_val = re.split(r'\s+Age\s*:', name_val, flags=re.IGNORECASE)[0]
        name_val = re.split(r'\s+Last Name\s*:', name_val, flags=re.IGNORECASE)[0]
        
        current_singer = {'name': name_val.strip()}
    elif ':' in line and current_singer and len(line) < 150:
        # Some lines combine multiple stats, e.g. "Male      Wieght  :  65kg    Hight  :  172"
        # We need to split by "    " or find multiple colons.
        parts_by_space = re.split(r'\s{2,}', line)
        for part in parts_by_space:
            if ':' in part:
                k, v = part.split(':', 1)
                k = k.strip().lower()
                v = v.strip()
                if k in ['age', 'gender', 'wieght', 'weight', 'hight', 'height', 'birth day', 'birthday', 'project', 'release date', 'voicer', 'voice source', 'voice rank', 'character item']:
                    current_singer[k] = v
                elif k == 'last name':
                    current_singer['name'] += ' ' + v
            else:
                # E.g. part is "Female", but the key was gender. If it's the first part:
                if 'gender' in line.lower() and part.lower() in ['male', 'female', 'lgbtq']:
                    current_singer['gender'] = part

if current_singer and 'name' in current_singer:
    singers[current_singer['name'].lower()] = current_singer

print(f"Extracted {len(singers)} singers from Wix data.")

# Create a mapping from filename to Wix data
filename_to_wix = {
    'ayanami_hikaru': 'ayanami hikaru',
    'fay': 'fay',
    'guren': 'guren',
    'kangfu': 'kangfu',
    'kochujang': 'kochujang',
    'kyoko': 'kyoko',
    'narisa': 'narisa',
    'onika': 'onika',
    'root': 'root',
    'savanna': 'savanna',
    'thitiya': 'thitiya',
    'tom': 'tom',
    'yamada_takeshi': 'yamada takeshi',
    'namphueng': 'namphueng',
    'charnsamorn': 'charnsamorn',
    'sakultala': 'sakultala',
    'diwachi': 'diwachi',
    'fangyu': "official name's fangyu", # Map "fangyu"
    'sriphan': 'sriphan'
}

# 2. Inject into HTML files
target_dir = r"A:\Program Developing\DELTA_SYNTH-main\src\public\singers"
files = glob.glob(os.path.join(target_dir, "*.html"))

updated_count = 0

for file_path in files:
    filename = os.path.basename(file_path).replace('.html', '')
    
    # Try to find a matching singer in Wix data
    wix_name = filename_to_wix.get(filename)
    if not wix_name:
        # fuzzy match
        for s_name in singers.keys():
            if filename.replace('_', ' ') in s_name or s_name in filename.replace('_', ' '):
                wix_name = s_name
                break
                
    if wix_name and wix_name in singers:
        data = singers[wix_name]
        
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        # Map HTML keys to Wix keys
        mappings = {
            'Name': data.get('name', ''),
            'Age': data.get('age', ''),
            'Gender': data.get('gender', ''),
            'Weight': data.get('weight', data.get('wieght', '')),
            'Height': data.get('height', data.get('hight', '')),
            'Voice Source': data.get('voicer', data.get('voice source', '')),
            'Character Item': data.get('character item', ''),
            'Birth Day': data.get('birth day', data.get('birthday', '')),
            'Release Date': data.get('release date', ''),
            'Project': data.get('project', '')
        }
        
        # Replace <span>Key : Unknown</span> or <span>Key : </span>
        for key, val in mappings.items():
            if val and val != '?':
                # regex to find <span>Key : <anything></span>
                pattern = rf'<span>{key}\s*:\s*(?:Unknown|.*?)</span>'
                replacement = f'<span>{key} : {val}</span>'
                html_content = re.sub(pattern, replacement, html_content, flags=re.IGNORECASE)
                
        # For the description text "(ประวัติอย่างละเอียดจะถูกเพิ่มในภายหลัง)" - it can be kept or removed
        # For now, we update the main bio metadata.
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
            
        print(f"Updated {filename}.html with data for {data.get('name')}")
        updated_count += 1

print(f"Total updated files: {updated_count}")
