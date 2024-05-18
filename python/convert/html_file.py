
# #  it convert to html  
# import fitz  # PyMuPDF
# import sys

# def convert_pdf_to_html(pdf_path, output_html_path):
#     doc = fitz.open(pdf_path)
#     html_content = ''
#     for page_number in range(doc.page_count):
#         page = doc[page_number]
#         html_content += page.get_text("html")

#     with open(output_html_path, 'w', encoding='utf-8') as html_file:
#         html_file.write(html_content)

# # Example usage
        

# pdf_file = './ok.pdf'
# html_output_file = 'ho.html'


# convert_pdf_to_html(pdf_file, html_output_file)











import fitz  # PyMuPDF
import os
import requests
from google.cloud import storage
import sys

def convert_pdf_to_html(pdf_content):
    doc = fitz.open(stream=pdf_content, filetype="pdf")
    html_content = ''
    for page_number in range(doc.page_count):
        page = doc[page_number]
        html_content += page.get_text("html")
    return html_content

def upload_to_gcs(html_content, bucket_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_string(html_content, content_type='text/html')
    print(f"HTML content uploaded to {destination_blob_name} in bucket {bucket_name}.")

# Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'sitfile.json'

# Example usage
pdf_url = sys.argv[1]
output_file_name = sys.argv[2]  # Output file name only
bucket_name = 'sitfile'  # Name of your GCS bucket

try:
    # Download the PDF from the URL
    response = requests.get(pdf_url)
    if response.status_code == 200:
        pdf_content = response.content
        html_content = convert_pdf_to_html(pdf_content)
        upload_to_gcs(html_content, bucket_name, output_file_name)
    else:
        print(f"Failed to download PDF from {pdf_url}")
except Exception as e:
    print(f"An error occurred: {e}")
