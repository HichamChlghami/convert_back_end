


// this code  compress videos 
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const upload = require('../../multer1');
const Convert = require('../../model/convert');
const bucket = require('../../google')


const conversionProgress = {};

router.post('/compressVideo', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;
        for (const file of files) {
            const convertType = req.body.convertType;
            const filename = req.body.filename;
            const inputPath = file.path;
            const fileOutput = req.body.fileOutput;

            const outputPath = path.join(__dirname, '../../files', fileOutput);
            const convert = new Convert({
                fileOutput: fileOutput,
                convertType: convertType,
                filename: filename,
            });
            convert.save();

            console.log(outputPath);
            console.log(fileOutput);
            console.log(convertType);

            ffmpeg(inputPath)
                // .videoCodec('libx264')
                // .outputOptions('-crf 28')
                .videoCodec('libx264')
                .outputOptions('-crf 30') // Increase CRF for higher compression (lower quality)
               
                .on('progress', (progress) => {
                    // Update the progress value
                    conversionProgress[fileOutput] = parseInt(progress.percent);
                })
                .on('end', function() {
                    // here delte file who store one GCS
                    // blob.delete();
                    // time for get the file and send it to GCS
                fs.unlinkSync(inputPath)

                    const blobOut = bucket.file(fileOutput);
                    const blobStreamOut = blobOut.createWriteStream();
                    blobStreamOut.on('finish', () => {
                        // delete file local
                        conversionProgress[fileOutput] = 100;
                fs.unlinkSync(outputPath)
            
                setTimeout(async () => {
                    try {
                        // Delete file from GCS
                        await bucket.file(fileOutput).delete();
            
                        // Delete corresponding entry from the database
                        // await Convert.findOneAndDelete({ fileOutput });
            
                        console.log(`File ${fileOutput} deleted from GCS and database.`);
                    } catch (error) {
                        console.error(`Error deleting file from GCS and database: ${error}`);
                    }
                },  2 *   60   *  60 * 1000);
            
            
                       
                    });
                blobStreamOut.on('error', async ()=>{
                    if(outputPath){
                        fs.unlinkSync(outputPath); // Delete the original video file
                
                        }
                    await bucket.file(fileOutput).delete();
            
                      
                })
                    const localReadStream = fs.createReadStream(outputPath);
                    localReadStream.pipe(blobStreamOut);
                })
                
                .on('error', function(err) {
                    console.error('Error during conversion: ' + err);
                    if(outputPath){
                      fs.unlinkSync(outputPath); // Delete the original video file
              
                      }
                      if(inputPath){
                          fs.unlinkSync(inputPath)
                  
                          }
              
                  })
                .save(outputPath);
        }

        res.json({ message: 'Videos converted to audio successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        // If an error occurs, make sure to clean up by deleting uploaded files
        for (const file of req.files) {
            fs.unlinkSync(file.path);
        }
    }
});

router.get('/progressCompressVideo', (req, res) => {
    res.json({ progress: conversionProgress });
});

module.exports = router;


