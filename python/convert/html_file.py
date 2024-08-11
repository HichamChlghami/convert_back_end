
#  it convert to html  
import fitz  # PyMuPDF
import sys

def convert_pdf_to_html(pdf_path, output_html_path):
    doc = fitz.open(pdf_path)
    html_content = ''
    for page_number in range(doc.page_count):
        page = doc[page_number]
        html_content += page.get_text("html")

    with open(output_html_path, 'w', encoding='utf-8') as html_file:
        html_file.write(html_content)

# Example usage
        

pdf_file = sys.argv[1]
html_output_file = sys.argv[2]


convert_pdf_to_html(pdf_file, html_output_file)





