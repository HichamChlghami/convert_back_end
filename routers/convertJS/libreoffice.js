
// this convert micro to pdf  + odt + rtf   
//  it convert excel to + csv xml and all the last in excel
//  this convert txt to pdf and odt and +rtf  and to image


'use strict';

const express = require('express');
const router = express.Router();
const libre = require('libreoffice-convert');
const upload = require('../../multer');
const Convert = require('../../model/convert');
libre.convertAsync = require('util').promisify(libre.convert);
const bucket = require('../../google');

const conversionProgress = {};

router.post('/office', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;

        for (const file of files) {
            const filename = req.body.filename;
            const convertType = req.body.convertType; // Type of format to convert to

            const fileBuffer = file.buffer; // File buffer as input

            const fileOutput = req.body.fileOutput; // Output file name

            const convertly = new Convert({
                fileOutput: fileOutput,
                convertType: convertType,
                filename: filename,
            });
            await convertly.save();
            conversionProgress[fileOutput] = 0;

            try {
                console.log('Conversion start');
                let convertedBuffer = await libre.convertAsync(fileBuffer, convertType, undefined);

                // Upload the converted file to GCS
                const blobOut = bucket.file(fileOutput);
                const blobStreamOut = blobOut.createWriteStream();

                blobStreamOut.on('finish', async () => {
                    conversionProgress[fileOutput] = 100;

                    // Schedule deletion of the file from GCS after 2 hours
                    setTimeout(async () => {
                        
                            await bucket.file(fileOutput).delete();
                        
                    }, 2 * 60 * 60 * 1000);
                });

                blobStreamOut.on('error', async () => {
                    console.error('Error uploading file to GCS');
                    await bucket.file(fileOutput).delete();
                });

                blobStreamOut.end(convertedBuffer);

            } catch (error) {
                console.error('Conversion error:', error);
                res.status(500).json({ error: 'Conversion error', message: error.message });
                return; // Exit the loop if an error occurs in conversion
            }
        }

        res.json({ message: 'Document conversion completed!' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
});

router.get('/progressOffice', (req, res) => {
    res.json({ progress: conversionProgress });
});

module.exports = router;
