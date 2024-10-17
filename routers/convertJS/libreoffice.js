
// this convert micro to pdf  + odt + rtf   
//  it convert excel to + csv xml and all the last in excel
//  this convert txt to pdf and odt and +rtf  and to image


// 'use strict';

// const express = require('express');
// const router = express.Router();
// const libre = require('libreoffice-convert');
// const upload = require('../../multer1');
// const Convert = require('../../model/convert');
// libre.convertAsync = require('util').promisify(libre.convert);
// const bucket = require('../../google');

// const conversionProgress = {};

// router.post('/office', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;

//         for (const file of files) {
//             const filename = req.body.filename;
//             const convertType = req.body.convertType; // Type of format to convert to

//             const fileBuffer = file.buffer; // File buffer as input

//             const fileOutput = req.body.fileOutput; // Output file name

//             const convertly = new Convert({
//                 fileOutput: fileOutput,
//                 convertType: convertType,
//                 filename: filename,
//             });
//             await convertly.save();
//             conversionProgress[fileOutput] = 0;

//             try {
//                 console.log('Conversion start');
//                 let convertedBuffer = await libre.convertAsync(fileBuffer, convertType, undefined);

//                 // Upload the converted file to GCS
//                 const blobOut = bucket.file(fileOutput);
//                 const blobStreamOut = blobOut.createWriteStream();

//                 blobStreamOut.on('finish', async () => {
//                     conversionProgress[fileOutput] = 100;

//                     // Schedule deletion of the file from GCS after 2 hours
//                     setTimeout(async () => {
                        
//                             await bucket.file(fileOutput).delete();
                        
//                     }, 2 * 60 * 60 * 1000);
//                 });

//                 blobStreamOut.on('error', async () => {
//                     console.error('Error uploading file to GCS');
//                     await bucket.file(fileOutput).delete();
//                 });

//                 blobStreamOut.end(convertedBuffer);

//             } catch (error) {
//                 console.error('Conversion error:', error);
//                 res.status(500).json({ error: 'Conversion error', message: error.message });
//                 return; // Exit the loop if an error occurs in conversion
//             }
//         }

//         res.json({ message: 'Document conversion completed!' });
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({ error: 'Server error', message: error.message });
//     }
// });

// router.get('/progressOffice', (req, res) => {
//     res.json({ progress: conversionProgress });
// });

// module.exports = router;







// 'use strict';

// const express = require('express');
// const router = express.Router();
// const libre = require('libreoffice-convert');
// const upload = require('../../multer1');
// const Convert = require('../../model/convert');
// const bucket = require('../../google');

// const conversionProgress = {};

// // Wrap the callback-based convert function to return a promise
// function convertAsync(buffer, format, options) {
//     return new Promise((resolve, reject) => {
//         libre.convert(buffer, format, options, (err, done) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(done);
//             }
//         });
//     });
// }

// router.post('/office', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;

//         for (const file of files) {
//             const filename = req.body.filename;
//             const convertType = req.body.convertType; // Type of format to convert to

//             const fileBuffer = file.buffer; // File buffer as input

//             const fileOutput = req.body.fileOutput; // Output file name

//             const convertly = new Convert({
//                 fileOutput: fileOutput,
//                 convertType: convertType,
//                 filename: filename,
//             });
//             await convertly.save();
//             conversionProgress[fileOutput] = 0;

//             try {
//                 console.log('Conversion start');
//                 let convertedBuffer = await convertAsync(fileBuffer, convertType, undefined);

//                 // Upload the converted file to GCS
//                 const blobOut = bucket.file(fileOutput);
//                 const blobStreamOut = blobOut.createWriteStream();

//                 blobStreamOut.on('finish', async () => {
//                     conversionProgress[fileOutput] = 100;

//                     // Schedule deletion of the file from GCS after 2 hours
//                     setTimeout(async () => {
//                         await bucket.file(fileOutput).delete();
//                     }, 2 * 60 * 60 * 1000);
//                 });

//                 blobStreamOut.on('error', async () => {
//                     console.error('Error uploading file to GCS');
//                     await bucket.file(fileOutput).delete();
//                 });

//                 blobStreamOut.end(convertedBuffer);

//             } catch (error) {
//                 console.error('Conversion error:', error);
//                 res.status(500).json({ error: 'Conversion error', message: error.message });
//                 return; // Exit the loop if an error occurs in conversion
//             }
//         }

//         res.json({ message: 'Document conversion completed!' });
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({ error: 'Server error', message: error.message });
//     }
// });

// router.get('/progressOffice', (req, res) => {
//     res.json({ progress: conversionProgress });
// });

// module.exports = router;
















// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');
// const libre = require('libreoffice-convert');
// const upload = require('../../multer');
// const Convert = require('../../model/convert');

// const conversionProgress = {};

// // Wrap the callback-based convert function to return a promise
// function convertAsync(buffer, format, options) {
//     return new Promise((resolve, reject) => {
//         libre.convert(buffer, format, options, (err, done) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(done);
//             }
//         });
//     });
// }

// router.post('/office', upload.array('files'), async (req, res) => {
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
//             conversionProgress[fileOutput] = 0;

//             console.log(`Input Path: ${inputPath}`);
//             console.log(`Output Path: ${outputPath}`);
//             console.log(`Convert Type: ${convertType}`);

//             try {
//                 const fileBuffer = fs.readFileSync(inputPath);
//                 console.log('Conversion start');
//                 const convertedBuffer = await convertAsync(fileBuffer, convertType, undefined);

//                 fs.writeFileSync(outputPath, convertedBuffer);

//                 console.log('Conversion finished successfully.');
//                 conversionProgress[fileOutput] = 100;
//                 fs.unlinkSync(inputPath);

//                 setTimeout(async () => {
//                     fs.unlinkSync(outputPath);
//                     await Convert.findOneAndDelete({ fileOutput });
//                 }, 1000 * 60 * 60 * 2); // 2 hours
//             } catch (error) {
//                 console.error('Conversion error:', error.message);
//                 fs.unlinkSync(inputPath);
//                 res.status(500).json({ error: 'Conversion error', message: error.message });
//                 return;
//             }
//         }

//         res.json({ message: 'Documents converted successfully!' });
//     } catch (error) {
//         console.error('Server error:', error.message);
//         res.status(500).json({ error: 'Server error', message: error.message });

//         for (const file of req.files) {
//             fs.unlinkSync(file.path);
//         }
//     }
// });

// router.get('/progressOffice', (req, res) => {
//     res.json({ progress: conversionProgress });
// });

// module.exports = router;





































const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const libre = require('libreoffice-convert');
const upload = require('../../multer');
const Convert = require('../../model/convert');

const conversionProgress = {};

function convertAsync(buffer, format, options) {
    return new Promise((resolve, reject) => {
        libre.convert(buffer, format, options, (err, done) => {
            if (err) {
                reject(err);
            } else {
                resolve(done);
            }
        });
    });
}

router.post('/office', upload.single('chunk'), async (req, res) => {
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
            
          if (fs.existsSync(inputPath)) {
            await fs.promises.unlink(inputPath);
              
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
          conversionProgress[fileOutput] = 0;

        

          try {
              const fileBuffer = fs.readFileSync(inputPath);
              console.log('Conversion start');
              const convertedBuffer = await convertAsync(fileBuffer, convertType, undefined);

              fs.writeFileSync(outputPath, convertedBuffer);

              console.log('Conversion finished successfully.');
              conversionProgress[fileOutput] = 100;
              if (fs.existsSync(inputPath)) {
                await fs.promises.unlink(inputPath);
                  
              }
              setTimeout(async () => {
                  // await Convert.findOneAndDelete({ fileOutput });
  
  
                  if (fs.existsSync(outputPath)) {
                    await fs.promises.unlink(outputPath);
                      
                  }
  
  
              }, 1000 * 60 * 60 * 2); // 2 hours
          } catch (error) {
              console.error('Conversion error:', error.message);
              fs.unlinkSync(inputPath);
              res.status(500).json({ error: 'Conversion error', message: error.message });
              return;
          }
            res.json({ message: 'Files converted successfully!' });
  
  
  
        
        } else {
          res.send('Chunk received');
        }
      });
    });
  });
  
  router.get('/progressOffice', (req, res) => {
    res.json({ progress: conversionProgress });
});

module.exports = router;

