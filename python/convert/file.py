# # this code use for compress  images 
# from PIL import Image

# def compress_image(input_path, output_path, quality=85):
#     """
#     Compresses an image by converting it to JPEG format.

#     Parameters:
#     - input_path (str): The path to the input image file.
#     - output_path (str): The path to save the compressed image.
#     - quality (int): The compression quality (0-100), higher values result in better quality.

#     Returns:
#     None
#     """
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
# input_image_path = 'hi.jpg'
# output_image_path = 'hi1.jpg'  # Changed the file extension to JPEG
# compress_image(input_image_path, output_image_path, quality=85)




















# # good for videos compress
# import ffmpeg
# import os

# def compress_video(input_path, output_path, crf=23):
#     try:
#         ffmpeg.input(input_path).output(output_path, vf='scale=640:-1', crf=crf).run(overwrite_output=True)
#         print(f"Compression successful. Output video saved to {output_path}")
#     except ffmpeg.Error as e:
#         print(f"Error during compression: {e.stderr}")
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")

# if __name__ == "__main__":
#     input_video_path = 'n.mp3'
#     output_video_path = 'compressed_audio.mp3'
    
#     if os.path.exists(input_video_path):
#         compress_video(input_video_path, output_video_path)
#     else:
#         print(f"Error: Input video file '{input_video_path}' not found.")















# # this code is good for compress audios very good
# import ffmpeg
# import os

# def compress_audio(input_path, output_path, audio_bitrate='64k'):
#     try:
#         ffmpeg.input(input_path).output(output_path, audio_bitrate=audio_bitrate).run(overwrite_output=True)
#         print(f"Compression successful. Output audio saved to {output_path}")
#     except ffmpeg.Error as e:
#         print(f"Error during compression: {e.stderr}")
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")

# if __name__ == "__main__":
#     input_audio_path = 'n.mp3'
#     output_audio_path = 'compressed_audio.mp3'
    
#     if os.path.exists(input_audio_path):
#         compress_audio(input_audio_path, output_audio_path)
#     else:
#         print(f"Error: Input audio file '{input_audio_path}' not found.")












# # this good in compress pdf 
# import fitz  # PyMuPDF

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
#     input_file = 'h.pdf'  # Replace with your input PDF file
#     output_file = 'compressed_output3.pdf'  # Replace with your desired output PDF file

#     compress_pdf(input_file, output_file)
#     print(f"PDF compression complete. Compressed file saved as {output_file}")







