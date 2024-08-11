
# this the code who convert all images pdf instead of text svg
from PIL import Image

import sys


input_image_path = sys.argv[1]
output_image_path = sys.argv[2]


# Convert the image to RGB mode (remove alpha channel if present)
img = Image.open(input_image_path).convert("RGB")

# Save the image in JPEG format
img.save(output_image_path)

print(f"Image converted from {input_image_path} to {output_image_path}")
















