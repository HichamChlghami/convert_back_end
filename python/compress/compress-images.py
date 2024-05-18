# # this code use for compress  images 
# from PIL import Image
# import sys


# def compress_image(input_path, output_path, quality=85):
 
#     try:
#         with Image.open(input_path) as img:
#             if img.mode == 'RGBA':
#                 img = img.convert('RGB')

#             # Enable Huffman table optimization for more powerful compression
#             img.save(output_path, 'JPEG', quality=quality, optimize=True)
#             print(f"Image compressed and saved to {output_path}")
#     except Exception as e:
#         print(f"Error: {e}")

# # Example usage:
# input_image_path = sys.argv[1]
# output_image_path = sys.argv[2]  # Changed the file extension to JPEG
# compress_image(input_image_path, output_image_path, quality=85)





import io
import os
import requests
from PIL import Image
from google.cloud import storage
import sys

# Define your paths
image_url = sys.argv[1]
output_file_name = sys.argv[2]  # Output file name only
format_type= 'jpeg'
 # Since we're compressing to JPEG
bucket_name = 'sitfile'  # Name of your GCS bucket
destination_blob_name = output_file_name
content_type = f"image/{format_type}"  # Adjust content type based on your needs

# Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'sitfile.json'
# Function to compress and upload file to GCS
def compress_and_upload_to_gcs(image_url, output_file_name, format_type, bucket_name, destination_blob_name, content_type, quality=85):
    try:
        # Download the image from the URL
        response = requests.get(image_url)
        if response.status_code == 200:
            img = Image.open(io.BytesIO(response.content))
            img = img.convert("RGB")  # Convert to RGB to remove alpha channel if present
            
            # Compress the image
            img_bytes = io.BytesIO()
            img.save(img_bytes, format=format_type, quality=quality, optimize=True)
            img_bytes.seek(0)

            # Initialize the GCS client
            storage_client = storage.Client()
            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(destination_blob_name)

            # Upload the compressed image to GCS with the appropriate content type
            blob.upload_from_string(img_bytes.getvalue(), content_type=content_type)
            print(f"Compressed image uploaded to {destination_blob_name}.")
        else:
            print(f"Failed to download image from {image_url}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Call the function to compress and upload the image
compress_and_upload_to_gcs(image_url, output_file_name, format_type, bucket_name, destination_blob_name, content_type)
