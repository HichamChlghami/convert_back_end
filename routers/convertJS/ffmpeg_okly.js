
// const express = require('express');
// const router = express.Router();
// // const path = require('path');
// const fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');
// const upload = require('../../multer');
// const Convert = require('../../model/convert');
// const bucket = require('../../google');

// const conversionProgress = {};


// router.post('/videoAudio', upload.array('files'), async (req, res) => {
//   try {
//       const files = req.files;
//       for (const file of files) {
//           const convertType = req.body.convertType;
//           const fileName = req.body.filename;
//           const fileOutput = req.body.fileOutput;
          
//           const inputFile = 'https://storage.googleapis.com/sitfile/hicham.mp4'
//           const outputFile = fileOutput; // Assuming 'fileOutput' contains the desired output file path

//           const convert = new Convert({
//               fileOutput: fileOutput,
//               convertType: convertType,
//               filename: fileName,
//           });
//           await convert.save();

//           console.log('Conversion start');

//           ffmpeg(inputFile)
//               .outputFormat(convertType)
//               .on('progress', (progress) => {
//                 conversionProgress[fileOutput] = parseInt(progress.percent);
//               })
         
              
//               .on('end', function() {
//                   console.log('Conversion finished');

//               })
//               .pipe(bucket.file(outputFile).createWriteStream())
//               .on('error', function(err) {
//                   console.error('Error uploading file to GCS: ' + err);
//               })
//               .on('finish', function() {
//                   console.log('File uploaded to GCS');
//                   // Optionally, you can delete the local file after uploading to GCS
//               conversionProgress[fileOutput] = 100;

//                   // fs.unlinkSync(inputFile);
//               })
//               .save(fileOutput);
//       }
//       res.json({ message: 'Videos converted to audio successfully!' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: error.message });
//       // for (const file of req.files) {
//       //     fs.unlinkSync(file.path);
//       // }
//   }
// });

// router.get('/progressVideoAudio', (req, res) => {
//   res.json({ progress: conversionProgress });
// });

// module.exports = router;
























const express = require('express');
const router = express.Router();
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const upload = require('../../multer');
const Convert = require('../../model/convert');
const bucket = require('../../google');

console.log('ffmpeg' , ffmpeg)
const conversionProgress = {};

router.post('/videoAudio', upload.array('files'), async (req, res) => {
  try {
      const files = req.files;
      for (const file of files) {
          const convertType = req.body.convertType;
          const fileName = req.body.filename;
          const fileOutput = req.body.fileOutput;
          
          const inputFile = 'https://storage.googleapis.com/sitfile/hicham.mp4';
          const outputFile = fileOutput; // Assuming 'fileOutput' contains the desired output file path

          const convert = new Convert({
              fileOutput: fileOutput,
              convertType: convertType,
              filename: fileName,
          });
          await convert.save();

          console.log('Conversion start');

          ffmpeg(inputFile)
              .outputFormat(convertType)
              .on('progress', (progress) => {
                conversionProgress[fileOutput] = parseInt(progress.percent);
              })
              .on('error', function(err) {
                  console.error('An error occurred: ' + err);
              })
              .on('end', function() {
                  console.log('Conversion finished');
              })
              .pipe(bucket.file(outputFile).createWriteStream())
              .on('error', function(err) {
                  console.error('Error uploading file to GCS: ' + err);
              })
              .on('finish', function() {
                  console.log('File uploaded to GCS');
                  conversionProgress[fileOutput] = 100; // Set progress to 100 after file upload
              });
      }
      res.json({ message: 'Videos converted to audio successfully!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
  }
});

router.get('/progressVideoAudio', (req, res) => {
  res.json({ progress: conversionProgress });
});

module.exports = router;











