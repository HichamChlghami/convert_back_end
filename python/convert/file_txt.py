import pdfplumber

input_file_path = './hicham.text'
output_file_path = 'hicham1.text'

def convert_to_text(input_file_path, output_file_path):
    try:
        # Open the PDF file
        with pdfplumber.open(input_file_path) as pdf:
            # Extract text
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        
        # Write text to output file
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            output_file.write(text)
            
        print(f"Text successfully extracted and saved to {output_file_path}")
    except Exception as e:
        print(f"Error converting {input_file_path} to text: {e}")

convert_to_text(input_file_path, output_file_path)
