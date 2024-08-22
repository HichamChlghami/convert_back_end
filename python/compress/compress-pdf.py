# this good in compress pdf 
import fitz  # PyMuPDF
import sys

def compress_pdf(input_pdf, output_pdf):
    pdf_document = fitz.open(input_pdf)
    pdf_writer = fitz.open()

    for page_num in range(pdf_document.page_count):
        page = pdf_document[page_num]
        new_page = pdf_writer.new_page(width=page.rect.width, height=page.rect.height)
        new_page.show_pdf_page(page.rect, pdf_document, page_num)

    pdf_writer.save(output_pdf, garbage=4, deflate=True, clean=True)
    pdf_writer.close()
    pdf_document.close()

if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]  # Replace with your desired output PDF file

    compress_pdf(input_file, output_file)
    print(f"PDF compression complete. Compressed file saved as {output_file}")








