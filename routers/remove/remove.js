


const express = require('express');
const router = express.Router();
const Convert = require('../../model/convert');
const upload = require('../../multer');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const path = require('path');


const conversionProgress = {};

const scriptPath = path.join(__dirname, '../../python/remove/remove.py');



router.post('/Remove', upload.single('chunk'), async (req, res) => {
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
  const outputPath  = path.join(__dirname , '../../files' , fileOutput)
            const convert = new Convert({
                fileOutput: fileOutput,
                convertType: convertType,
                filename: filename,
            });
            await convert.save();


           console.log('fileOutput' , fileOutput)
           console.log('filename' , filename)


            const executePythonScript = async (inputPath, outputPath) => {
                return new Promise((resolve, reject) => {
                    console.log('Executing Python script');

                    const pyShell = new PythonShell(scriptPath, { args: [inputPath,  outputPath] });

                    pyShell.on('message', (msg) => {
                        console.log(`Message from Python script: ${msg}`);
                      


                                                // Schedule the deletion of the output file and the database record
                        setTimeout(async () => {
                            try {
                                fs.unlinkSync(outputPath);
                                await Convert.findOneAndDelete({ fileOutput: fileOutput });

                            } catch (err) {
                                console.error('Error deleting output file or database record:', err);
                            }
                        }, 1000 * 60 * 60 * 2);





                    

                    });

                    pyShell.end(async (err) => {
                        if (err) {
                            console.error('Error executing Python script:', err);
                            fs.unlinkSync(inputPath)

                            reject(err);
                        } else {
                fs.unlinkSync(inputPath)

                            console.log('Python script execution finished');
                            conversionProgress[fileOutput] = 100;
                            resolve();
                        }
                    });
                });
            };

            try {
                await executePythonScript(inputPath, outputPath);
            } catch (err) {
                console.error('Python script failed:', err);
                fs.unlinkSync(inputPath)

                res.status(500).json({ error: 'Python script failed', message: err.message });
                return;
            }

          
          res.json({ message: 'Files converted successfully!' });



      
      } else {
        res.send('Chunk received');
      }
    });
  });
});








router.get('/progressRemove', (req, res) => {
    res.json({  progress:conversionProgress   });
  });
  
  
  module.exports = router;
