import os
from PIL import Image

folder = r"c:\Users\matha\OneDrive\Pictures\Desktop\fitness\screenshots"
output_folder = r"c:\Users\matha\OneDrive\Pictures\Desktop\fitness\screenshots\fixed"

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

files = [f for f in os.listdir(folder) if f.endswith('.png')]

print(f"Found {len(files)} images to fix...")

for f in files:
    try:
        path = os.path.join(folder, f)
        img = Image.open(path)
        
        # Target 1080x1920 (9:16)
        target_w, target_h = 1080, 1920
        new_img = Image.new("RGB", (target_w, target_h), (18, 18, 24)) # Dark background matching app theme
        
        # Resize input to fit width (1080)
        # Input is 1024x1024. Resize to 1080x1080
        img_resized = img.resize((1080, 1080), Image.Resampling.LANCZOS)
        
        # Paste in center
        y_pos = (target_h - 1080) // 2
        new_img.paste(img_resized, (0, y_pos))
        
        output_path = os.path.join(output_folder, f)
        new_img.save(output_path)
        print(f"Fixed: {f}")
    except Exception as e:
        print(f"Failed {f}: {e}")

print("All Done.")
