



# from rembg import remove
# from PIL import Image, UnidentifiedImageError
# import io
# import os

# # Load your images
# input_path = './h.jfif'  # The image from which to remove the background
# bg_path = './x.jpg'      # The background image

# # Get the output path with the same name and format as the input image
# output_path = input_path  # Output will have the same name and format as input

# try:
#     # Read the input image
#     with open(input_path, 'rb') as input_file:
#         input_image = input_file.read()

#     # Remove the background from the input image
#     output_image = remove(input_image)

#     # Convert the output image to a PIL Image
#     output_image = Image.open(io.BytesIO(output_image))

#     # Load the background image
#     bg_image = Image.open(bg_path)

#     # Resize the background to match the output image size (if needed)
#     bg_image = bg_image.resize(output_image.size)

#     # Combine images (paste the output image onto the background)
#     bg_image.paste(output_image, (0, 0), output_image)

#     # Check the mode of the output image and convert if necessary
#     if output_image.mode == 'RGBA':
#         # Save as PNG to preserve transparency
#         output_path = input_path
#         bg_image.save(output_path, format='PNG')
#     else:
#         # Convert to RGB if saving as JPEG
#         bg_image = bg_image.convert('RGB')
#         bg_image.save(output_path)

#     print(f"Output image saved as: {output_path}")

# except UnidentifiedImageError:
#     print("Error: The input image could not be identified. Please check the file format.")
# except Exception as e:
#     print(f"An error occurred: {e}")



# from rembg import remove
# from PIL import Image, UnidentifiedImageError
# import io
# import os

# # Load your images
# input_path = './x.jpg'  # The image from which to remove the background
# bg_color = (0, 0, 0)  # Background color (white in this case)

# # Get the output path with the same name and format as the input image
# output_path = input_path

# try:
#     # Read the input image
#     with open(input_path, 'rb') as input_file:
#         input_image = input_file.read()

#     # Remove the background from the input image
#     output_image = remove(input_image)

#     # Convert the output image to a PIL Image
#     output_image = Image.open(io.BytesIO(output_image)).convert("RGBA")

#     # Create a new image with the specified background color
#     bg_image = Image.new("RGBA", output_image.size, bg_color)

#     # Combine images (paste the output image onto the colored background)
#     bg_image.paste(output_image, (0, 0), output_image)

#     # Save the combined image
#     bg_image.save(output_path, format='PNG')

#     print(f"Output image saved as: {output_path}")

# except UnidentifiedImageError:
#     print("Error: The input image could not be identified. Please check the file format.")
# except Exception as e:
#     print(f"An error occurred: {e}")
