import re

with open("drive_response.txt", "r", encoding="utf-8") as f:
    html = f.read()

# Look for filename patterns like "DELTA SYNTH", "VCV", ".zip", etc.
# Drive usually puts file names in quotes, like "Something.zip" or "DELTA SYNTH VCV"
matches = re.findall(r'"([^"]+(?:(?i)\.zip|\.rar|\.7z|vcv|cvvc|delta|synth)[^"]*)"', html)
matches = list(set(matches))
print(f"Found {len(matches)} potential filenames:")
for m in matches[:50]:
    print(m)
