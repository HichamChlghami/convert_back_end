
# # this the code who convert all images pdf instead of text svg
# from PIL import Image

# import sys


# input_image_path = sys.argv[1]
# output_image_path = sys.argv[2]


# # Convert the image to RGB mode (remove alpha channel if present)
# img = Image.open(input_image_path).convert("RGB")

# # Save the image in JPEG format
# img.save(output_image_path)

# print(f"Image converted from {input_image_path} to {output_image_path}")












import io
import os
import requests
from PIL import Image
from google.cloud import storage
import sys

# Define your paths
image_url = sys.argv[1]
format_type = sys.argv[2]
destination_blob_name = sys.argv[3]
bucket_name = 'sitfile'  # Name of your GCS bucket
content_type = f"image/{format_type.lower()}"  # Adjust content type based on your needs

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

# Download the image from the URL and process it
response = requests.get(image_url)
if response.status_code == 200:
    try:
        # Open the image directly from the response content
        img = Image.open(io.BytesIO(response.content))
        img = img.convert("RGB")  # Convert to RGB to remove alpha channel if present
        img_bytes = io.BytesIO()
        img.save(img_bytes, format=format_type.upper())
        img_bytes.seek(0)

        # Upload the resulting image content to GCS with the appropriate content type
        upload_to_gcs(bucket_name, img_bytes.getvalue(), destination_blob_name, content_type)
    except Exception as e:
        print(f"An error occurred: {e}")
else:
    print(f"Failed to download image from {image_url}")
