

const express = require('express');
const router = express.Router();
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const upload = require('../../multer');
const Convert = require('../../model/convert');
const bucket = require('../../google');

          const inputFile = 'https://storage.googleapis.com/sitfile/hicham.mp4';
          const outputFile = 'hi.mp3'; // Assuming 'fileOutput' contains the desired output file path

        
          console.log('Conversion start');

          ffmpeg(inputFile)
              .outputFormat('mp3')
              .on('progress', (progress) => {
                conversionProgress[fileOutput] = parseInt(progress.percent);
              })
              .on('error', function(err) {
                  console.error('An error occurred: ' + err.message);
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





module.exports = router;
