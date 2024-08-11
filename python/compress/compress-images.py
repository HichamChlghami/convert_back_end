


from PIL import Image
import sys

def compress_image(input_path, output_path, quality=85):
    try:
        with Image.open(input_path) as img:
            if img.mode == 'RGBA':
                img = img.convert('RGB')

            # Enable Huffman table optimization for more powerful compression
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            print(f"Image compressed and saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

# Example usage:
input_image_path = sys.argv[1]
output_image_path = sys.argv[2]  # Changed the file extension to JPEG
# You can adjust the quality as needed
compress_image(input_image_path, output_image_path, quality=70)


