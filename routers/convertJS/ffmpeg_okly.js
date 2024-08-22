




// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const upload = require('../../multer');
// const Convert = require('../../model/convert');

// ffmpeg.setFfmpegPath(ffmpegPath);

// const conversionProgress = {};

// router.post('/videoAudio', upload.array('files'), async (req, res) => {
//   try {
//     const files = req.files;
//     const { convertType, filename, fileOutput } = req.body;

//     for (const file of files) {
//       const inputPath = file.path;
//       const outputPath = path.join(__dirname, '../../files', fileOutput);

//       const convert = new Convert({
//         fileOutput: fileOutput,
//         convertType: convertType,
//         filename: filename,
//       });
//       await convert.save();

//       let outputFormat = convertType;
//       if (convertType === 'aac') {
//         outputFormat = 'adts'; // Use 'adts' for AAC audio
//       }

//       ffmpeg(inputPath)
//         .outputFormat(outputFormat)
//         .on('progress', (progress) => {
//           conversionProgress[fileOutput] = parseInt(progress.percent);
//         })
//         .on('error', (err) => {
//           console.error('An error occurred: ' + err.message);
//           fs.unlinkSync(inputPath); // Clean up input file on error
//           res.status(500).json({ error: 'An error occurred during conversion.' });
//         })
//         .on('end', () => {
//           console.log('Conversion finished');
//           conversionProgress[fileOutput] = 100;

//           // Cleanup after conversion
//           fs.unlinkSync(inputPath);
//           setTimeout(async () => {
//             if (fs.existsSync(outputPath)) {
//               fs.unlinkSync(outputPath);
//             }
//             await Convert.findOneAndDelete({ fileOutput });
//           }, 1000 * 60 * 60 * 2); // 2 hours
//         })
//         .save(outputPath);
//     }

//     res.json({ message: 'Files converted successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An internal server error occurred.' });

//     // Cleanup files on server error
//     if (req.files) {
//       for (const file of req.files) {
//         fs.unlinkSync(file.path);
//       }
//     }
//   }
// });

// router.get('/progressVideoAudio', (req, res) => {
//   res.json({ progress: conversionProgress });
// });

// module.exports = router;























const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../../multer');


const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const Convert = require('../../model/convert');

ffmpeg.setFfmpegPath(ffmpegPath);






const conversionProgress = {};

router.post('/videoAudio', upload.single('chunk'), async (req, res) => {
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

      // Check if all chunks are received
      if (chunkIndex + 1 === totalChunksCount) {
        console.log('File uploaded successfully');

        // the logic for convert here 
              const convert = new Convert({
        fileOutput: fileOutput,
        convertType: convertType,
        filename: filename,
      });
      await convert.save();
      

      const outputPath = path.join(__dirname, '../../files', fileOutput);

          
      
            let outputFormat = convertType;
            if (convertType === 'aac') {
              outputFormat = 'adts'; // Use 'adts' for AAC audio
            }
      
            ffmpeg(inputPath)
              .outputFormat(outputFormat)
              .on('progress', (progress) => {
                conversionProgress[fileOutput] = parseInt(progress.percent);
              })
              .on('error', (err) => {
                console.error('An error occurred: ' + err.message);
                fs.unlinkSync(inputPath); // Clean up input file on error
                res.status(500).json({ error: 'An error occurred during conversion.' });
              })
              .on('end', () => {
                console.log('Conversion finished');
                conversionProgress[fileOutput] = 100;
      
                // Cleanup after conversion
                fs.unlinkSync(inputPath);
                setTimeout(async () => {
                  if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                  }
                  await Convert.findOneAndDelete({ fileOutput });
                }, 1000 * 60 * 60 * 10); // 2 hours
              })
              .save(outputPath);
          
          res.json({ message: 'Files converted successfully!' });



      
      } else {
        res.send('Chunk received');
      }
    });
  });
});


router.get('/progressVideoAudio', (req, res) => {
  res.json({ progress: conversionProgress });
});



module.exports = router;
