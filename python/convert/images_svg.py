
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
















# import ffmpeg

# import sys


# def convert_avif(input_image_path, output_image_path):
#     (
#         ffmpeg
#         .input(input_image_path)
#         .output(output_image_path)
#         .run()
#     )

# if __name__ == "__main__":
#     input_image_path = sys.argv[1]
#     output_image_path = sys.argv[2]

#     convert_avif(input_image_path, output_image_path)




















# import sys
# import os
# from PIL import Image
# import imageio
# import ffmpeg

# # Supported formats for using PIL (convert to PDF or other image formats)
# pdf_formats = ['png', 'jpeg', 'jfif', 'ico', 'gif', 'psd', 'webp', 'bmp', 'jpg', 'tiff', 'jpeg', 'tga', 'eps', 'pdf']

# def convert_using_pil(input_image_path, output_image_path):
#     try:
#         # Convert the image to RGB mode (remove alpha channel if present)
#         img = Image.open(input_image_path).convert("RGB")
#         # Save the image in the desired format
#         img.save(output_image_path)
#         print(f"Image converted from {input_image_path} to {output_image_path} successfully using PIL.")
#     except Exception as e:
#         print(f"An error occurred during conversion with PIL: {e}")

# def convert_using_imageio(input_image_path, output_image_path):
#     try:
#         # Read the input image
#         img = imageio.imread(input_image_path)
#         # Write the image in the desired format
#         imageio.imwrite(output_image_path, img)
#         print(f"Image converted from {input_image_path} to {output_image_path} successfully using imageio.")
#     except Exception as e:
#         print(f"An error occurred during conversion with imageio: {e}")

# def convert_avif(input_image_path, output_image_path):
#     (
#         ffmpeg
#         .input(input_image_path)
#         .output(output_image_path)
#         .run()
#     )

# if __name__ == "__main__":
#     if len(sys.argv) != 3:
#         print("Usage: python convert_image.py <input_image_path> <output_image_path>")
#         sys.exit(1)

#     input_image_path = sys.argv[1]
#     output_image_path = sys.argv[2]
    
#     # Get the file extensions of the input and output images
#     input_extension = os.path.splitext(input_image_path)[1].lower().lstrip('.')
#     output_extension = os.path.splitext(output_image_path)[1].lower().lstrip('.')
    
#     # Check if the input format is AVIF and use ffmpeg for conversion
#     if input_extension == 'avif':
#         convert_avif(input_image_path, output_image_path)
#     elif input_extension in pdf_formats and output_extension in pdf_formats:
#         convert_using_pil(input_image_path, output_image_path)
#     else:
#         convert_using_imageio(input_image_path, output_image_path)

















# import sys
# import os
# from PIL import Image
# import imageio
# import ffmpeg
# import svgwrite
# import base64
# from io import BytesIO

# # Supported formats for using PIL (convert to PDF or other image formats)
# pdf_formats = ['png', 'jpeg', 'jfif', 'ico', 'gif', 'psd', 'webp', 'bmp', 'jpg', 'tiff', 'jpeg', 'tga', 'eps', 'pdf']

# def convert_using_pil(input_image_path, output_image_path):
#     try:
#         # Convert the image to RGB mode (remove alpha channel if present)
#         img = Image.open(input_image_path).convert("RGB")
#         # Save the image in the desired format
#         img.save(output_image_path)
#         print(f"Image converted from {input_image_path} to {output_image_path} successfully using PIL.")
#     except Exception as e:
#         print(f"An error occurred during conversion with PIL: {e}")

# def convert_using_imageio(input_image_path, output_image_path):
#     try:
#         # Read the input image
#         img = imageio.imread(input_image_path)
#         # Write the image in the desired format
#         imageio.imwrite(output_image_path, img)
#         print(f"Image converted from {input_image_path} to {output_image_path} successfully using imageio.")
#     except Exception as e:
#         print(f"An error occurred during conversion with imageio: {e}")

# def convert_avif(input_image_path, output_image_path):
#     (
#         ffmpeg
#         .input(input_image_path)
#         .output(output_image_path)
#         .run()
#     )

# def image_to_svg(image_path, svg_path):
#     # Open the image using Pillow
#     img = Image.open(image_path)
#     width, height = img.size

#     # Create an SVG drawing
#     dwg = svgwrite.Drawing(svg_path, profile='tiny', size=(width, height))

#     # Convert image to base64
#     buffered = BytesIO()
#     img.save(buffered, format="PNG")  # Save as PNG in memory
#     img_str = base64.b64encode(buffered.getvalue()).decode()

#     # Add the image to the SVG
#     dwg.add(dwg.image(href='data:image/png;base64,' + img_str, insert=(0, 0), size=(width, height)))

#     # Save the SVG file
#     dwg.save()
#     print(f"Image converted from {image_path} to {svg_path} successfully as SVG.")

# if __name__ == "__main__":
#     if len(sys.argv) != 3:
#         print("Usage: python convert_image.py <input_image_path> <output_image_path>")
#         sys.exit(1)

#     input_image_path = sys.argv[1]
#     output_image_path = sys.argv[2]
    
#     # Get the file extensions of the input and output images
#     input_extension = os.path.splitext(input_image_path)[1].lower().lstrip('.')
#     output_extension = os.path.splitext(output_image_path)[1].lower().lstrip('.')
    
#     # Check if the input format is AVIF and use ffmpeg for conversion
#     if input_extension == 'avif':
#         convert_avif(input_image_path, output_image_path)
#     elif output_extension == 'svg':
#         image_to_svg(input_image_path, output_image_path)
#     elif input_extension in pdf_formats and output_extension in pdf_formats:
#         convert_using_pil(input_image_path, output_image_path)
#     else:
#         convert_using_imageio(input_image_path, output_image_path)
