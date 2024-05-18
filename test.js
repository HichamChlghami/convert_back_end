const pdf2html = require('pdf2html');
const fs = require('fs');
const path = require('path');

// Path to your input PDF file
const inputPdf = './ok.pdf'

// Path to your output HTML file
const outputHtml = 'hello.html'

// Function to convert PDF to HTML
const convertPdfToHtml = (input, output) => {
    pdf2html.html(input, (err, html) => {
        if (err) {
            console.error('Conversion error: ' + err);
        } else {
            console.log('Conversion successful.');
            fs.writeFileSync(output, html);
        }
    });
};

// Execute the conversion
convertPdfToHtml(inputPdf, outputHtml);
