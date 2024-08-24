















// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');
// const upload = require('../../multer');
// const Convert = require('../../model/convert');

// const compressionProgress = {};

// router.post('/compressVideo', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;
//         for (const file of files) {
//             const filename = req.body.filename;
//             const fileOutput = req.body.fileOutput;
//             const inputPath = file.path;
//             const outputPath = path.join(__dirname, '../../files', fileOutput);

//             // Create a new conversion record in the database
//             const compress = new Convert({
//                 fileOutput: fileOutput,
//                 convertType: 'compression',
//                 filename: filename,
//             });
//             await compress.save();

//             console.log(`Input Path: ${inputPath}`);
//             console.log(`Output Path: ${outputPath}`);

//             // Start video compression
//             ffmpeg(inputPath)
//                 .videoCodec('libx264')
//                 .audioCodec('aac') // Use AAC for audio codec
//                 .outputOptions([
//                     '-crf 35', // Higher CRF for more compression (lower quality)
//                     '-preset slower', // Use 'slower' preset for better compression efficiency
//                     '-b:v 500k', // Set video bitrate to lower quality and reduce size
//                     '-b:a 128k', // Set audio bitrate for lower quality
//                     '-vf scale=640:-1', // Resize video to 640px width while maintaining aspect ratio
//                 ])
//                 .on('progress', (progress) => {
//                     // Update the progress value
//                     compressionProgress[fileOutput] = parseInt(progress.percent);
//                 })
//                 .on('end', () => {
//                     console.log('Compression finished successfully.');
//                     compressionProgress[fileOutput] = 100;
//                     fs.unlinkSync(inputPath);

//                     setTimeout(async () => {
//                         fs.unlinkSync(outputPath);
//                         await Convert.findOneAndDelete({ fileOutput });
//                     }, 1000 * 60 * 60 * 2); // 2 hours
//                 })
//                 .on('error', (err) => {
//                     console.error('Error during compression:', err.message);
//                     // Clean up the uploaded file on error
//                     fs.unlinkSync(inputPath);
//                 })
//                 .save(outputPath);
//         }

//         res.json({ message: 'Videos compressed successfully!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//         // If an error occurs, make sure to clean up by deleting uploaded files
//         for (const file of req.files) {
//             fs.unlinkSync(file.path);
//         }
//     }
// });

// router.get('/progressCompressVideo', (req, res) => {
//     res.json({ progress: compressionProgress });
// });

// module.exports = router;


















const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const upload = require('../../multer');
const Convert = require('../../model/convert');

const compressionProgress = {};



router.post('/compressVideo', upload.single('chunk'), async (req, res) => {
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
  
        // delte inputPath  for any  error  
        setTimeout(async()=>{
          if(inputPath){
            fs.unlinkSync(inputPath)
  
            }          
      },1000 * 60 * 60 * 2)
        // Check if all chunks are received
        if (chunkIndex + 1 === totalChunksCount) {
            const outputPath = path.join(__dirname, '../../files', fileOutput);

            // Create a new conversion record in the database
            const compress = new Convert({
                fileOutput: fileOutput,
                convertType: 'compression',
                filename: filename,
            });
            await compress.save();

          

            // Start video compression
            ffmpeg(inputPath)
                .videoCodec('libx264')
                .audioCodec('aac') // Use AAC for audio codec
                .outputOptions([
                    '-crf 35', // Higher CRF for more compression (lower quality)
                    '-preset slower', // Use 'slower' preset for better compression efficiency
                    '-b:v 500k', // Set video bitrate to lower quality and reduce size
                    '-b:a 128k', // Set audio bitrate for lower quality
                    '-vf scale=640:-1', // Resize video to 640px width while maintaining aspect ratio
                ])
                .on('progress', (progress) => {
                    // Update the progress value
                    compressionProgress[fileOutput] = parseInt(progress.percent);
                })
                .on('end', () => {
                    console.log('Compression finished successfully.');
                    compressionProgress[fileOutput] = 100;
                    fs.unlinkSync(inputPath);

                    setTimeout(async () => {
                        fs.unlinkSync(outputPath);
                        // await Convert.findOneAndDelete({ fileOutput });
                    }, 1000 * 60 * 60 * 2); // 2 hours
                })
                .on('error', (err) => {
                    console.error('Error during compression:', err.message);
                    // Clean up the uploaded file on error
                    fs.unlinkSync(inputPath);
                })
                .save(outputPath);
            
            res.json({ message: 'Files converted successfully!' });
  
  
  
        
        } else {
          res.send('Chunk received');
        }
      });
    });
  });
  


  router.get('/progressCompressVideo', (req, res) => {
    res.json({ progress: compressionProgress });
});

module.exports = router;
