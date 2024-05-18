


import io
import os
import requests
from PIL import Image
from docx import Document
from docx.shared import Inches
from google.cloud import storage
import sys

# Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'sitfile.json'

# Function to upload file to GCS
def upload_to_gcs(bucket_name, file_content, destination_blob_name, content_type):
    # Initialize the GCS client
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    # Upload the file
    blob.upload_from_string(file_content, content_type=content_type)
    print(f"File content uploaded to {destination_blob_name}.")

# Define your paths
image_url = sys.argv[1]

output_docx_filename = sys.argv[3]
bucket_name = 'sitfile'  # Name of your GCS bucket
content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"  # Content type for DOCX files

# Download the image from the URL and process it
response = requests.get(image_url)
if response.status_code == 200:
    try:
        # Open the image directly from the response content
        img = Image.open(io.BytesIO(response.content))
        img = img.convert("RGB")  # Convert to RGB to remove alpha channel if present

        # Create a new Word document
        doc = Document()
        doc.add_picture(io.BytesIO(response.content), width=Inches(4))  # Add the image to the document

        # Save the Word document to a BytesIO object
        doc_bytes = io.BytesIO()
        doc.save(doc_bytes)
        doc_bytes.seek(0)

        # Upload the resulting DOCX content to GCS with the appropriate content type
        upload_to_gcs(bucket_name, doc_bytes.getvalue(), output_docx_filename, content_type)
        print(f"Conversion successful. Document saved as {output_docx_filename} and uploaded to GCS.")
    except Exception as e:
        print(f"An error occurred: {e}")
else:
    print(f"Failed to download image from {image_url}")
