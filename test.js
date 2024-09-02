const sharp = require('sharp');
const fs = require('fs');

const convertPngToSvg = async (inputPath, outputPath) => {
    try {
        // Read the PNG image
        const data = await sharp(inputPath)
            .toBuffer();

        // Create an SVG that embeds the PNG
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <image href="data:image/png;base64,${data.toString('base64')}" width="100%" height="100%" />
            </svg>
        `;

        // Write the SVG file
        fs.writeFileSync(outputPath, svgContent);
        console.log(`Converted ${inputPath} to ${outputPath} with colors retained.`);
    } catch (err) {
        console.error('Error during conversion:', err);
    }
};

// Example usage
const inputPng = 'x.jpg'; // Update with your actual path
const outputSvg = 'puyteeeooot.svg'; // Update with your actual path
convertPngToSvg(inputPng, outputSvg);
