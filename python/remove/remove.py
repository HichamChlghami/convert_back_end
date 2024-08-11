from rembg import remove
import sys

# Load the input image
input_path = sys.argv[1]  
output_path = sys.argv[2]

# Open the input image
with open(input_path, 'rb') as input_file:
    input_image = input_file.read()

# Remove the background
output_image = remove(input_image)

# Save the output image
with open(output_path, 'wb') as output_file:
    output_file.write(output_image)





input_image_path = sys.argv[1]
output_image_path = sys.argv[2]