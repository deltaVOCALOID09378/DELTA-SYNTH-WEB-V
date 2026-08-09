import re

with open(r"f:\All DELTA SYNTH Official Website\3._All Voicebank _ DELTA SYNTH.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

char = "Kochujang"
match = re.search(re.escape(char), html, re.IGNORECASE)
if match:
    start_idx = match.start()
    chunk = html[start_idx:start_idx+10000]
    print(f"Found {char} at {start_idx}, chunk size {len(chunk)}")
    
    links = re.findall(r'<a[^>]+href="([^"]+)"[^>]*aria-label="([^"]+)"', chunk, re.IGNORECASE)
    print("Matches with aria-label:", links)
    
    a_tags = re.findall(r'<a\s+[^>]+>', chunk, re.IGNORECASE)
    for tag in a_tags:
        print("TAG:", tag)
