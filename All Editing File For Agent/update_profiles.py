# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "beautifulsoup4",
# ]
# ///
import json
import re
import os
from pathlib import Path
from bs4 import BeautifulSoup

def main():
    print("Starting character data extraction and profile update...")
    base_dir = Path(r"d:\DELTA_SYNTH-main")
    data_file = base_dir / "src" / "backend" / "assets" / "data" / "content.json"
    
    if not data_file.exists():
        print(f"Error: Could not find data file at {data_file}")
        return

    with open(data_file, 'r', encoding='utf-8') as f:
        content = json.load(f)
    
    # We want data from "3._All Voicebank _ DELTA SYNTH.html"
    lines = content.get("3._All Voicebank _ DELTA SYNTH.html", [])
    text_data = "\n".join(lines)
    
    # We will build a regex to extract character blocks.
    # Split the text whenever a line starts with Name
    chunks = re.split(r'\n(?=Name\s*[:：]?)', text_data, flags=re.IGNORECASE)
    
    characters = {}
    for chunk in chunks:
        if not chunk.strip(): continue
        
        # Extract fields using regex
        # Look for "Name : Value"
        name_match = re.search(r'Name\s*[:：]?\s*([^:\n]+?)(?:\s+Age|\s+Gender|\s+Wieght|\s+Hight|\s+Birth Day|\s+Project|$)', chunk, re.IGNORECASE)
        if not name_match:
            continue
        
        name = name_match.group(1).strip().replace("Official name's ", "").replace("​", "")
        if not name or name == "?":
            continue
            
        def extract_field(field_names):
            if isinstance(field_names, str):
                field_names = [field_names]
            
            for field in field_names:
                match = re.search(rf'{field}\s*[:：]\s*([^:\n]+?)(?:\s+Age|\s+Gender|\s+Wieght|\s+Hight|\s+Birth Day|\s+Project|\s+Release Date|\s+Voicer|\s+Voice Rank|\s+Genre|\s+Main Item|\s+Character Item|\s+Like|\s+Dislike|$)', chunk, re.IGNORECASE)
                if match:
                    val = match.group(1).strip().replace("​", "")
                    return val
            return "Unknown"

        char_data = {
            "name": name,
            "Age": extract_field("Age"),
            "Gender": extract_field("Gender"),
            "Weight": extract_field("Wieght"),
            "Height": extract_field("Hight"),
            "Birthday": extract_field("Birth Day"),
            "Project": extract_field("Project"),
            "Release Date": extract_field("Release Date"),
            "Voicer": extract_field("Voicer"),
            "Voice Rank": extract_field("Voice Rank"),
            "Genre": extract_field("Genre"),
            "Main Item": extract_field("Main Item"),
            "Character Item": extract_field("Character Item"),
            "Like": extract_field("Like"),
            "Dislike": extract_field("Dislike"),
        }
        
        # Clean up missing data
        for k, v in char_data.items():
            if v == "?" or v == "" or "Unknown" in v:
                char_data[k] = "Unknown"
                
        # Add normalizations
        normalized_name = name.lower().replace(" ", "_").replace("​", "")
        characters[normalized_name] = char_data
        print(f"Parsed: {name} -> {char_data['Age']}, {char_data['Gender']}, {char_data['Voicer']}, {char_data['Genre']}")

    # 1. Update src/public/voicebank.html
    voicebank_path = base_dir / "src" / "public" / "voicebank.html"
    print(f"\nUpdating {voicebank_path} ...")
    with open(voicebank_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    # In voicebank, each character is in a div with a title in <h3>
    updated_count = 0
    for div in soup.find_all('div', class_='p-6 flex-grow flex flex-col items-center text-center'):
        h3 = div.find('h3')
        if not h3: continue
        char_name_display = h3.get_text().strip()
        normalized_name = char_name_display.lower().replace(" ", "_")
        
        char_match = characters.get(normalized_name)
        if not char_match:
            # Try fuzzy match
            for k, v in characters.items():
                if k in normalized_name or normalized_name in k:
                    char_match = v
                    break
                    
        if char_match:
            ul = div.find('ul')
            if ul:
                items = ul.find_all('li')
                if len(items) == 4:
                    items[0].contents[-1].replace_with(f" {char_match['Age']}")
                    items[1].contents[-1].replace_with(f" {char_match['Gender']}")
                    items[2].contents[-1].replace_with(f" {char_match['Voicer']}")
                    items[3].contents[-1].replace_with(f" {char_match['Genre']}")
                    updated_count += 1

    with open(voicebank_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    print(f"Updated {updated_count} profiles in voicebank.html")

    # 2. Update individual singer profiles
    singers_dir = base_dir / "src" / "public" / "singers"
    print(f"\nUpdating individual singer profiles in {singers_dir} ...")
    singer_updated = 0
    for html_file in singers_dir.glob("*.html"):
        normalized_name = html_file.stem
        char_match = characters.get(normalized_name)
        if not char_match:
            for k, v in characters.items():
                if k in normalized_name or normalized_name in k:
                    char_match = v
                    break
        
        if not char_match:
            continue
            
        with open(html_file, 'r', encoding='utf-8') as f:
            file_html = f.read()
            
        soup2 = BeautifulSoup(file_html, 'html.parser')
        
        glass_panel = soup2.find(class_='glass-panel')
        if glass_panel:
            def update_field(label_text, new_value):
                label_p = glass_panel.find(lambda tag: tag.name == "p" and label_text.lower() in tag.get_text().lower() and "text-xs" in tag.get("class", []))
                if label_p:
                    value_p = label_p.find_next_sibling("p")
                    if value_p:
                        value_p.string = new_value

            update_field("Age / Gender", f"{char_match['Age']}, {char_match['Gender']}")
            update_field("Genre", char_match['Genre'])
            update_field("Voicer", char_match['Voicer'])
            update_field("Voice Rank", char_match['Voice Rank'])
            update_field("Weight / Height", f"{char_match['Weight']} / {char_match['Height']}")
            update_field("Birthday", char_match['Birthday'])
            update_field("Release Date", char_match['Release Date'])
            update_field("Project", char_match['Project'])
            update_field("Main Item", char_match['Main Item'])
            update_field("Character Item", char_match['Character Item'])
            update_field("Like", char_match['Like'])
            update_field("Dislike", char_match['Dislike'])
            
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(str(soup2))
            singer_updated += 1
            print(f"  -> Updated {html_file.name}")
            
    print(f"Finished updating {singer_updated} individual files.")

if __name__ == "__main__":
    main()
