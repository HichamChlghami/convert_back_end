

# # this good in compress pdf 
# import fitz  # PyMuPDF
# import sys

# def compress_pdf(input_pdf, output_pdf):
#     pdf_document = fitz.open(input_pdf)
#     pdf_writer = fitz.open()

#     for page_num in range(pdf_document.page_count):
#         page = pdf_document[page_num]
#         new_page = pdf_writer.new_page(width=page.rect.width, height=page.rect.height)
#         new_page.show_pdf_page(page.rect, pdf_document, page_num)

#     pdf_writer.save(output_pdf, garbage=4, deflate=True, clean=True)
#     pdf_writer.close()
#     pdf_document.close()

# if __name__ == "__main__":
#     input_file = sys.argv[1]
#     output_file = sys.argv[2]  # Replace with your desired output PDF file

#     compress_pdf(input_file, output_file)
#     print(f"PDF compression complete. Compressed file saved as {output_file}")








# import io
# import os
# import requests
# import fitz  # PyMuPDF
# from google.cloud import storage
# import sys

# # Define your paths
# pdf_url = 'https://storage.googleapis.com/sitfile/ok.pdf'
# output_file_name = 'strong_fileNmae' # Output file name only
# bucket_name = 'sitfile'  # Name of your GCS bucket
# destination_blob_name = output_file_name

# # Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'sitfile.json'

# # Function to compress and upload PDF to GCS
# def compress_and_upload_pdf_to_gcs(pdf_url, output_file_name, bucket_name, destination_blob_name):
#     try:
#         # Download the PDF from the URL
#         response = requests.get(pdf_url)
#         if response.status_code == 200:
#             pdf_bytes = io.BytesIO(response.content)

#             # Compress the PDF
#             pdf_document = fitz.open(pdf_bytes)
#             compressed_pdf_bytes = io.BytesIO()
#             pdf_document.save(compressed_pdf_bytes, garbage=4, deflate=True, clean=True)
#             compressed_pdf_bytes.seek(0)
#             pdf_document.close()

#             # Initialize the GCS client
#             storage_client = storage.Client()
#             bucket = storage_client.bucket(bucket_name)
#             blob = bucket.blob(destination_blob_name)

#             # Upload the compressed PDF to GCS
#             blob.upload_from_string(compressed_pdf_bytes.getvalue(), content_type='application/pdf')
#             print(f"Compressed PDF uploaded to {destination_blob_name}.")
#         else:
#             print(f"Failed to download PDF from {pdf_url}")
#     except Exception as e:
#         print(f"An error occurred: {e}")

# # Call the function to compress and upload the PDF
# compress_and_upload_pdf_to_gcs(pdf_url, output_file_name, bucket_name, destination_blob_name)













import io
import os
import requests
import fitz  # PyMuPDF
from google.cloud import storage
import sys

# Define your paths
pdf_url =sys.argv[1]
output_file_name =  sys.argv[2]  # Output file name only
bucket_name = 'sitfile'  # Name of your GCS bucket
destination_blob_name = output_file_name

# Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'sitfile.json'

# Function to compress and upload PDF to GCS
def compress_and_upload_pdf_to_gcs(pdf_url, output_file_name, bucket_name, destination_blob_name):
    try:
        # Download the PDF from the URL
        response = requests.get(pdf_url)
        if response.status_code == 200:
            pdf_bytes = response.content

            # Open the PDF using PyMuPDF from bytes
            pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")

            # Compress the PDF
            compressed_pdf_bytes = io.BytesIO()
            pdf_document.save(compressed_pdf_bytes, garbage=4, deflate=True, clean=True)
            compressed_pdf_bytes.seek(0)
            pdf_document.close()

            # Initialize the GCS client
            storage_client = storage.Client()
            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(destination_blob_name)

            # Upload the compressed PDF to GCS
            blob.upload_from_string(compressed_pdf_bytes.getvalue(), content_type='application/pdf')
            print(f"Compressed PDF uploaded to {destination_blob_name}.")
        else:
            print(f"Failed to download PDF from {pdf_url}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Call the function to compress and upload the PDF
compress_and_upload_pdf_to_gcs(pdf_url, output_file_name, bucket_name, destination_blob_name)
