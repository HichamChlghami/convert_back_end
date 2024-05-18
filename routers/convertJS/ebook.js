const express = require('express');
const router = express.Router();
const PDFParser = require('pdf-parse');
const epubGen = require('epub-gen');
const upload = require('../../multer');
const Convert = require('../../model/convert');
const bucket = require('../../google');

let conversionProgress = {};

router.post('/ebook', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;

        for (const file of files) {
            const convertType = req.body.convertType;
            const filename = req.body.filename;
            const fileBuffer = file.buffer; // File buffer as input

            const fileOutput = req.body.fileOutput; // Output file name

            const convertly = new Convert({
                fileOutput,
                convertType,
                filename,
            });

            conversionProgress[fileOutput] = 0;

            
              // Parse PDF content
              const data = await PDFParser(fileBuffer);

              // Prepare content for eBook
              const title = 'Title';
              const author = 'Name';
              const content = data.text;

              // Generate EPUB eBook
              const options = {
                  title,
                  author,
                  content: [{ data: content, title: 'Chapter 1' }], // You can customize this based on your PDF structure
              };

              // Generate EPUB buffer
              const epubBuffer = await new epubGen(options).promise;

              // Upload the generated eBook to GCS
              const blobOut = bucket.file(fileOutput);
              const blobStreamOut = blobOut.createWriteStream();

              blobStreamOut.on('finish', async () => {
                  conversionProgress[fileOutput] = 100;
                  console.log('Conversion completed');
              });

              blobStreamOut.on('error', async (error) => {
                  console.error('Error uploading file to GCS:', error);
                  conversionProgress[fileOutput] = -1;
                  // Delete the failed upload from GCS
                  await bucket.file(fileOutput).delete();
              });

              blobStreamOut.end(epubBuffer);
        
            await convertly.save();
        }

        res.json({ message: 'Document conversion completed!' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
});

router.get('/progressEbook', (req, res) => {
    res.json({ progress: conversionProgress });
});

module.exports = router;
