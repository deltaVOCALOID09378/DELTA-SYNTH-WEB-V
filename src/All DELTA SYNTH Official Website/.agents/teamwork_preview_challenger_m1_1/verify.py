import os
import json

def verify():
    base_dir = r"E:\All DELTA SYNTH Official Website"
    full_path = os.path.join(base_dir, r"assets\images\voicebanks\full")
    profile_path = os.path.join(base_dir, r"assets\images\voicebanks\profile")
    content_path = os.path.join(base_dir, r"assets\data\content.json")

    results = {}
    
    # Check full body images
    if os.path.exists(full_path):
        full_imgs = [f for f in os.listdir(full_path) if os.path.isfile(os.path.join(full_path, f))]
        results['full_body_count'] = len(full_imgs)
    else:
        results['full_body_count'] = 0
        
    # Check profile images
    if os.path.exists(profile_path):
        profile_imgs = [f for f in os.listdir(profile_path) if os.path.isfile(os.path.join(profile_path, f))]
        results['profile_count'] = len(profile_imgs)
    else:
        results['profile_count'] = 0

    # Check content.json
    results['content_json_valid'] = False
    results['content_json_non_empty'] = False
    
    if os.path.exists(content_path):
        try:
            with open(content_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            results['content_json_valid'] = True
            
            # check non-empty
            if isinstance(data, dict):
                if len(data) > 0 and any(len(v) > 0 for v in data.values() if isinstance(v, list) or isinstance(v, dict)):
                    results['content_json_non_empty'] = True
                elif len(data) > 0:
                    results['content_json_non_empty'] = True
            elif isinstance(data, list):
                if len(data) > 0:
                    results['content_json_non_empty'] = True
        except Exception as e:
            results['content_json_error'] = str(e)
            
    print("Verification Results:")
    print(json.dumps(results, indent=2))
    
    if results['full_body_count'] == 55 and results['profile_count'] == 55 and results['content_json_valid'] and results['content_json_non_empty']:
        print("ALL PASSED")
    else:
        print("FAILED")

if __name__ == "__main__":
    verify()
