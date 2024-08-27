
# # this the code who convert all images pdf instead of text svg
# from PIL import Image

# import sys


# input_image_path = sys.argv[1]
# output_image_path = sys.argv[2]


# # Convert the image to RGB mode (remove alpha channel if present)
# img = Image.open(input_image_path).convert("RGB")

# # Save the image in JPEG format
# img.save(output_image_path)

# print(f"Image converted from {input_image_path} to {output_image_path}")





import sys
import os
from PIL import Image
import imageio
import subprocess

# Supported formats for using PIL (convert to PDF or other image formats)
pdf_formats = ['png', 'jpeg', 'jfif', 'ico', 'gif', 'psd', 'webp', 'bmp', 'jpg', 'tiff', 'jpeg', 'tga', 'eps', 'pdf']

def convert_using_pil(input_image_path, output_image_path):
    try:
        # Convert the image to RGB mode (remove alpha channel if present)
        img = Image.open(input_image_path).convert("RGB")
        # Save the image in the desired format
        img.save(output_image_path)
        print(f"Image converted from {input_image_path} to {output_image_path} successfully using PIL.")
    except Exception as e:
        print(f"An error occurred during conversion with PIL: {e}")

def convert_using_imageio(input_image_path, output_image_path):
    try:
        # Read the input image
        img = imageio.imread(input_image_path)
        # Write the image in the desired format
        imageio.imwrite(output_image_path, img)
        print(f"Image converted from {input_image_path} to {output_image_path} successfully using imageio.")
    except Exception as e:
        print(f"An error occurred during conversion with imageio: {e}")

def convert_using_ffmpeg(input_image_path, output_image_path):
    try:
        subprocess.run(["ffmpeg", "-i", input_image_path, output_image_path], check=True)
        print(f"Image converted from {input_image_path} to {output_image_path} successfully using ffmpeg.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred during conversion with ffmpeg: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_image.py <input_image_path> <output_image_path>")
        sys.exit(1)

    input_image_path = sys.argv[1]
    output_image_path = sys.argv[2]
    
    # Get the file extensions of the input and output images
    input_extension = os.path.splitext(input_image_path)[1].lower().lstrip('.')
    output_extension = os.path.splitext(output_image_path)[1].lower().lstrip('.')
    
    # Check if the input format is AVIF and use ffmpeg for conversion
    if input_extension == 'avif':
        convert_using_ffmpeg(input_image_path, output_image_path)
    elif input_extension in pdf_formats and output_extension in pdf_formats:
        convert_using_pil(input_image_path, output_image_path)
    else:
        convert_using_imageio(input_image_path, output_image_path)
