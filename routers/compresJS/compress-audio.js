



const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const upload = require('../../multer');
const Convert = require('../../model/convert');


const conversionProgress = {};


router.post('/compressAudio', upload.single('chunk'), async (req, res) => {
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
            
  if (fs.existsSync(inputPath)) {
    await fs.promises.unlink(inputPath);
      
  }

},1000 * 60 * 60 * 2)

        // Check if all chunks are received
        if (chunkIndex + 1 === totalChunksCount) {
            const outputPath = path.join(__dirname, '../../files', fileOutput);

            const convert = new Convert({
                fileOutput: fileOutput,
                convertType: convertType,
                filename: filename,
            });
            convert.save();

            const compressionOptions = {
                audioCodec: 'libmp3lame', // Codec for audio compression
                audioBitrate: '32k', // Target bitrate for audio
              };



            ffmpeg(inputPath)
            .audioCodec(compressionOptions.audioCodec)
  .audioBitrate(compressionOptions.audioBitrate)
               
                .on('progress', (progress) => {
                    // Update the progress value
                    conversionProgress[fileOutput] = parseInt(progress.percent);
                })
                .on('end', async function() {
                   
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
            
            res.json({ message: 'Files converted successfully!' });
  
  
  
        
        } else {
          res.send('Chunk received');
        }
      });
    });
  });
  

  router.get('/progressCompressAudio', (req, res) => {
    res.json({ progress: conversionProgress });
});

module.exports = router;
