

import io
import os
import requests
from pdf2docx import Converter
from google.cloud import storage
import tempfile
import sys

# Define your paths

pdf_url = sys.argv[1]
format_type = sys.argv[2]
destination_blob_name = sys.argv[3]
bucket_name = 'sitfile'  # Name of your GCS bucket
content_type = f"document/{format_type}"# PDF to DOCX conversion function

# PDF to DOCX conversion function
def pdf_to_docx(pdf_path):
    # Convert PDF to DOCX in memory
    cv = Converter(pdf_path)
    docx_stream = io.BytesIO()
    cv.convert(docx_stream, start=0, end=None)
    cv.close()
    docx_stream.seek(0)
    return docx_stream.getvalue()

# Function to upload file to GCS
def upload_to_gcs(bucket_name, file_content, destination_blob_name, content_type):
    # Initialize the GCS client
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # Upload the file
    blob.upload_from_string(file_content, content_type=content_type)
    print(f"File content uploaded to {destination_blob_name}.")

# Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'sitfile.json'

# Download the PDF file from the URL
response = requests.get(pdf_url)
if response.status_code == 200:
    # Save the PDF content to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf_file:
        temp_pdf_file.write(response.content)
        temp_pdf_path = temp_pdf_file.name

    try:
        # Convert the PDF to DOCX in memory
        docx_content = pdf_to_docx(temp_pdf_path)
        # Upload the resulting DOCX content to GCS with the appropriate content type
        upload_to_gcs(bucket_name, docx_content, destination_blob_name, content_type)
    finally:
        # Clean up the temporary file
        os.remove(temp_pdf_path)
else:
    print(f"Failed to download PDF file from {pdf_url}")






