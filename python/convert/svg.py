






# import imageio
# import svgwrite
# import sys
# import os

# def convert_image_to_svg(input_image_path, output_svg_path):
#     # Read the image
#     img = imageio.imread(input_image_path)

#     # Create SVG drawing
#     dwg = svgwrite.Drawing(output_svg_path, profile='tiny')

#     # Add image to SVG
#     image_uri = 'file://' + os.path.abspath(input_image_path)
#     dwg.add(dwg.image(image_uri, size=(img.shape[1], img.shape[0])))

#     # Save SVG file
#     dwg.save()

# if __name__ == "__main__":
#     if len(sys.argv) != 3:
#         print("Usage: python script.py input_image_path output_svg_path")
#         sys.exit(1)

#     input_image_path = './one.jfif'
#     output_svg_path = 'hicham.svg'
#     convert_image_to_svg(input_image_path, output_svg_path)


# print('success')










# import imageio
# import svgwrite
# import sys
# import os

# def convert_image_to_svg(input_image_path, output_svg_path):
#     # Read the image
#     img = imageio.imread(input_image_path)

#     # Create SVG drawing
#     dwg = svgwrite.Drawing(output_svg_path, profile='tiny')

#     # Add image to SVG
#     image_uri = 'file://' + os.path.abspath(input_image_path)
#     dwg.add(dwg.image(image_uri, size=(img.shape[1], img.shape[0])))

#     # Save SVG file
#     dwg.save()

# if __name__ == "__main__":
#     # Commenting out argument checking and using hardcoded paths
#     # if len(sys.argv) != 3:
#     #     print("Usage: python script.py input_image_path output_svg_path")
#     #     sys.exit(1)

    
#     input_image_path = sys.argv[1]
#     output_svg_path = sys.argv[2]
#     convert_image_to_svg(input_image_path, output_svg_path)



import io
import os
import requests
import imageio
import svgwrite
from google.cloud import storage
import sys

# Define your paths
image_url = sys.argv[1]
destination_blob_name = sys.argv[2]
bucket_name = 'sitfile'  # Name of your GCS bucket

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

# Function to convert image URL to SVG
def convert_image_to_svg(image_url, output_svg_path):
    # Download the image from the URL
    response = requests.get(image_url)
    if response.status_code == 200:
        img = imageio.imread(io.BytesIO(response.content))

        # Create SVG drawing
        dwg = svgwrite.Drawing(output_svg_path, profile='tiny')

        # Add image to SVG directly from URL
        dwg.add(dwg.image(image_url, insert=(0, 0), size=(img.shape[1], img.shape[0])))

        # Save SVG file content to a bytes buffer
        svg_content = dwg.tostring()
        return svg_content
    else:
        raise Exception(f"Failed to download image from {image_url}")

try:
    # Convert the image URL to SVG
    svg_content = convert_image_to_svg(image_url, destination_blob_name)

    # Upload the resulting SVG content to GCS with the appropriate content type
    upload_to_gcs(bucket_name, svg_content, destination_blob_name, "image/svg+xml")
except Exception as e:
    print(f"An error occurred: {e}")
