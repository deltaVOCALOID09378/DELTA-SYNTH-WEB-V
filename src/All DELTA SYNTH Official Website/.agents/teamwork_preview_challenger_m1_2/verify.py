import os
import json

def main():
    base_dir = r"e:\All DELTA SYNTH Official Website"
    full_dir = os.path.join(base_dir, "assets", "images", "voicebanks", "full")
    profile_dir = os.path.join(base_dir, "assets", "images", "voicebanks", "profile")
    json_path = os.path.join(base_dir, "assets", "data", "content.json")

    full_imgs = os.listdir(full_dir) if os.path.exists(full_dir) else []
    profile_imgs = os.listdir(profile_dir) if os.path.exists(profile_dir) else []

    print(f"Full body images: {len(full_imgs)}")
    print(f"Profile images: {len(profile_imgs)}")
    print(f"Total images: {len(full_imgs) + len(profile_imgs)}")

    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"Valid JSON: True")
            print(f"Non-empty data: {bool(data)}")
    except Exception as e:
        print(f"Valid JSON: False")
        print(f"JSON Error: {e}")

if __name__ == '__main__':
    main()
