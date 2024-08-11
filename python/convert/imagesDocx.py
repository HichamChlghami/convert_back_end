import io
from PIL import Image
from docx import Document
from docx.shared import Inches
import sys

# Read input image path and output DOCX filename from command line arguments
input_image_path = sys.argv[1]
output_docx_filename = sys.argv[2]

try:
    # Open the image from the file path
    with open(input_image_path, 'rb') as image_file:
        image_bytes = image_file.read()  # Read the image file bytes
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert("RGB")  # Convert to RGB to remove alpha channel if present

        # Create a new Word document
        doc = Document()
        doc.add_picture(io.BytesIO(image_bytes), width=Inches(4))  # Add the image to the document

        # Save the Word document to the specified file path
        doc.save(output_docx_filename)
        print(f"Conversion successful. Document saved as {output_docx_filename}.")
except Exception as e:
    print(f"An error occurred: {e}")
