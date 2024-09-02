import fitz  # PyMuPDF
import os
from PIL import Image
import io

def compress_image(image_bytes, quality=30, max_size=(800, 800)):
    # Open the image using Pillow
    image = Image.open(io.BytesIO(image_bytes))
    
    # Resize the image if it's larger than max_size
    image.thumbnail(max_size, Image.LANCZOS)  # Use LANCZOS instead of ANTIALIAS

    # Save the image to a bytes buffer with reduced quality
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=quality)
    return buffer.getvalue()

def compress_pdf(input_file, output_file):
    # Open the original PDF
    pdf_document = fitz.open(input_file)
    
    # Create a new PDF to hold the compressed content
    compressed_pdf = fitz.open()

    for page in pdf_document:
        # Create a new page in the compressed PDF
        new_page = compressed_pdf.new_page(width=page.rect.width, height=page.rect.height)

        # Copy the content of the original page to the new page
        new_page.show_pdf_page(new_page.rect, pdf_document, page.number)

        # Optimize images on the page
        for img in page.get_images(full=True):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image['image']

            # Compress the image using Pillow
            compressed_image = compress_image(image_bytes, quality=30)

            # Replace the original image with the compressed image
            new_page.insert_image(new_page.rect, stream=compressed_image)

    # Save the new PDF with aggressive compression
    compressed_pdf.save(output_file, garbage=4, deflate=True)

    # Check the file size and provide feedback
    file_size = os.path.getsize(output_file)
    print(f"Compressed PDF size: {file_size / (1024 * 1024):.2f} MB")

# Example usage
compress_pdf('n.pdf', '7compressed_output.pdf')
