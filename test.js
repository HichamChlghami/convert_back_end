// const libre = require('libreoffice-convert');
// const fs = require('fs');
// const path = require('path');

// async function compressPdf(inputPath, outputPath) {
//   try {
//     // Read the PDF file
//     const file = fs.readFileSync(inputPath);
    
//     // Convert the PDF to PDF with compression
//     libre.convert(file, '.pdf', undefined, (err, output) => {
//       if (err) {
//         console.error('Error converting PDF:', err);
//         return;
//       }

//       // Write the compressed PDF to the output path
//       fs.writeFileSync(outputPath, output);

//       console.log('PDF compression complete!');
//     });
//   } catch (error) {
//     console.error('Error compressing PDF:', error);
//   }
// }

// // Usage
// const inputPath = path.join(__dirname, 'nn.pdf');
// const outputPath = path.join(__dirname, 'output_compressed.pdf');

// compressPdf(inputPath, outputPath);




const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to convert PDF to DOCX
function convertPdfToDocx(inputFilePath, outputDir) {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Prepare the LibreOffice command
    const command = `soffice --headless --convert-to docx --outdir "${outputDir}" "${inputFilePath}"`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`File converted successfully. Output in: ${outputDir}`);
    });
}

// Example usage
const inputPdf = path.resolve(__dirname, 'x.pdf');
const outputDir = path.resolve(__dirname, 'file.docx');
convertPdfToDocx(inputPdf, outputDir);
