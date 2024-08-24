


// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');
// const Tesseract = require('tesseract.js');
// const pdfParse = require('pdf-parse');
// const upload = require('../../multer');
// const Convert = require('../../model/convert');

// const conversionProgress = {};

// router.post('/imagesTxt', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;
//         const { convertType, filename, fileOutput } = req.body;

//         for (const file of files) {
//             const inputPath = file.path;
//             const outputPath = path.join(__dirname, '../../files', fileOutput);

//             const convert = new Convert({
//                 fileOutput: fileOutput,
//                 convertType: convertType,
//                 filename: filename,
//             });
//             await convert.save();

//             console.log(`Input Path: ${inputPath}`);
//             console.log(`Output Path: ${outputPath}`);
//             console.log(`Convert Type: ${convertType}`);

//             let text = '';
//             const fileBuffer = fs.readFileSync(inputPath);

//             if (file.mimetype === 'application/pdf') {
//                 const data = await pdfParse(fileBuffer);
//                 text = data.text;
//             } else if (file.mimetype.startsWith('image/')) {
//                 const result = await Tesseract.recognize(fileBuffer, 'eng', {});
//                 text = result.data.text;
//             } else {
//                 const result = await Tesseract.recognize(fileBuffer, 'eng', {});
//                 text = result.data.text;
//             }

//             console.log('Text recognized:', text);
//             fs.writeFileSync(outputPath, text);

//             console.log('Conversion finished successfully.');
//             conversionProgress[fileOutput] = 100;
//             fs.unlinkSync(inputPath);

//             setTimeout(async () => {
//                 fs.unlinkSync(outputPath);
//                 await Convert.findOneAndDelete({ fileOutput });
//             }, 1000 * 60 * 60 * 2); // 2 hours
//         }

//         res.json({ message: 'Documents converted successfully!' });
//     } catch (error) {
//         console.error('Error during conversion:', error.message);
//         res.status(500).json({ error: error.message });

//         for (const file of req.files) {
//             fs.unlinkSync(file.path);
//         }
//     }
// });

// router.get('/progressImageTxt', (req, res) => {
//     res.json({ progress: conversionProgress });
// });

// module.exports = router;







const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const upload = require('../../multer');
const Convert = require('../../model/convert');

const conversionProgress = {};




router.post('/imagesTxt', upload.single('chunk'), async (req, res) => {
    const { chunkNumber, totalChunks, fileName, convertType, fileOutput, filename } = req.body;
    const chunkIndex = parseInt(chunkNumber, 10);
    const totalChunksCount = parseInt(totalChunks, 10);
    // Open the file in append mode
    const inputPath = path.join(__dirname, '../../files', fileName);
    fs.open(inputPath, 'a', (err, fileDescriptor) => {
      if (err) {
        return res.status(500).send('Error opening file');
      }
  
      // Write the chunk directly to the final file
      fs.write(fileDescriptor, req.file.buffer, 0, req.file.buffer.length, chunkIndex * req.file.buffer.length, async (err) => {
        if (err) {
          fs.close(fileDescriptor);
          return res.status(500).send('Error writing chunk');
        }
  
        // Close the file descriptor after writing
        fs.close(fileDescriptor);
        setTimeout(async()=>{
          if(inputPath){
            fs.unlinkSync(inputPath)
  
            }          
      },1000 * 60 * 60 * 2)
        // Check if all chunks are received
        if (chunkIndex + 1 === totalChunksCount) {
          console.log('File uploaded successfully');
  
          const outputPath = path.join(__dirname, '../../files', fileOutput);

          const convert = new Convert({
              fileOutput: fileOutput,
              convertType: convertType,
              filename: filename,
          });
          await convert.save();

         
          let text = '';
          const fileBuffer = fs.readFileSync(inputPath);
const formatFile = inputPath.split('.').pop()
          if (formatFile === 'pdf') {
              const data = await pdfParse(fileBuffer);
              text = data.text;
          } else {
              const result = await Tesseract.recognize(fileBuffer, 'eng', {});
              text = result.data.text;
          }

          console.log('Text recognized:', text);
          fs.writeFileSync(outputPath, text);

          console.log('Conversion finished successfully.');
          conversionProgress[fileOutput] = 100;
          fs.unlinkSync(inputPath);

          setTimeout(async () => {
              fs.unlinkSync(outputPath);
              // await Convert.findOneAndDelete({ fileOutput });
          }, 1000 * 60 * 60 * 2); // 2 hours
            
            res.json({ message: 'Files converted successfully!' });
  
  
  
        
        } else {
          res.send('Chunk received');
        }
      });
    });
  });
  


  router.get('/progressImageTxt', (req, res) => {
    res.json({ progress: conversionProgress });
});

module.exports = router;