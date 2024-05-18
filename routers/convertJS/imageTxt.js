



// // // it convert image to txt 


// const express = require('express');
// const router = express.Router();
// const Tesseract = require('tesseract.js');
// const upload = require('../../multer');
// const Convert = require('../../model/convert');
// const bucket = require('../../google');

// let conversionProgress = {};

// router.post('/imagesTxt', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;

//         for (const file of files) {
//             const convertType = req.body.convertType;
//             const filename = req.body.filename;
//             const inputBuffer = file.buffer; // Assuming 'file.buffer' contains the image buffer

//             const outputFileName = req.body.fileOutput; // Name of the file to be created in GCS

//             conversionProgress[outputFileName] = 0;

//             await Tesseract.recognize(
//                 inputBuffer,
//                 'eng', // language code, e.g., 'eng' for English
//                 {}
//             ).then(({ data: { text } }) => {
//                 console.log('Text recognized:', text);

//                 // Upload the recognized text to GCS
//                 const file = bucket.file(outputFileName);
//                 const writeStream = file.createWriteStream({
//                     metadata: {
//                         contentType: 'text/plain',
//                     },
//                 });
//                 writeStream.write(text);
//                 writeStream.end();

//                 writeStream.on('finish', () => {
//                     console.log('Text uploaded to GCS');
//                     conversionProgress[outputFileName] = 100;
//                 });

//                 writeStream.on('error', (error) => {
//                     console.error('Error uploading text to GCS:', error);
//                     conversionProgress[outputFileName] = -1;
//                 });
//             }).catch(error => {
//                 console.error('Error during OCR:', error);
//                 conversionProgress[outputFileName] = -1;
//             });

//             // Save conversion details to the database
//             await new Convert({
//                 fileOutput: outputFileName,
//                 convertType,
//                 filename,
//             }).save();
//         }

//         res.json({ message: 'Document conversion completed!' });
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({ error: 'Server error', message: error.message });
//     }
// });

// router.get('/progressImageTxt', (req, res) => {
//     res.json({ progress: conversionProgress });
// });

// module.exports = router;




















const express = require('express');
const router = express.Router();
const Tesseract = require('tesseract.js');
const upload = require('../../multer');
const Convert = require('../../model/convert');
const bucket = require('../../google');
const pdfParse = require('pdf-parse');

let conversionProgress = {};

router.post('/imagesTxt', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;

        for (const file of files) {
            const convertType = req.body.convertType;
            const filename = req.body.filename;
            const inputBuffer = file.buffer; // Assuming 'file.buffer' contains the file buffer

            const outputFileName = req.body.fileOutput; // Name of the file to be created in GCS

            conversionProgress[outputFileName] = 0;

            let text = '';


         


            if (file.mimetype === 'application/pdf') {
                // Process PDF
                const data = await pdfParse(inputBuffer);
                text = data.text;
            } else if (file.mimetype.startsWith('image/')) {
                // Process Image using Tesseract
                const result = await Tesseract.recognize(inputBuffer, 'eng', {});
                text = result.data.text;
            } else {
                const result = await Tesseract.recognize(inputBuffer, 'eng', {});
                text = result.data.text;            }

            console.log('Text recognized:', text);

            // Upload the recognized text to GCS
            const gcsFile = bucket.file(outputFileName);
            const writeStream = gcsFile.createWriteStream({
                metadata: {
                    contentType: 'text/plain',
                },
            });
            writeStream.write(text);
            writeStream.end();

            writeStream.on('finish', () => {
                console.log('Text uploaded to GCS');
                conversionProgress[outputFileName] = 100;
            });

            writeStream.on('error', (error) => {
                console.error('Error uploading text to GCS:', error);
                conversionProgress[outputFileName] = -1;
            });

            // Save conversion details to the database
            await new Convert({
                fileOutput: outputFileName,
                convertType,
                filename,
            }).save();
        }

        res.json({ message: 'Document conversion completed!' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
});

router.get('/progressImageTxt', (req, res) => {
    res.json({ progress: conversionProgress });
});

module.exports = router;
















