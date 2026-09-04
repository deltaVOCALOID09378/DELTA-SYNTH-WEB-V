import urllib.request
import re

url = "https://drive.google.com/drive/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    with open("drive_response.txt", "w", encoding="utf-8") as f:
        f.write(html)
        
    print("Saved response to drive_response.txt. Length:", len(html))
    
    # Try to find file IDs using a generic regex
    file_ids = re.findall(r'\["([^"]+)",[^,]+,"([^"]+)"\]', html)
    print("Found potential matches:", len(file_ids))
except Exception as e:
    print("Error:", e)
