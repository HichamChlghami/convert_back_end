

const express = require('express')
const router = express.Router()
const path = require('path');

const fs = require('fs');
const Convert = require('../../model/convert');
const upload = require('../../multer1')
const { PythonShell } = require('python-shell');
const bucket = require('../../google')



const conversionProgress = {}

const scriptPath = path.join(__dirname, '../../python/convert/txt.py');

  router.post('/txt', upload.array('files'), async (req, res) => {
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
  
     
  
        const executePythonScript = async (inputPath, outputPath  ) => {
            return new Promise((resolve, reject) => {
                const pyShell = new PythonShell(scriptPath, { args: [inputPath, outputPath ] });
            
                pyShell.on('message', (msg) => {
                  console.log(`Message from Python script: ${msg}`);

                });
            
                pyShell.end((err) => {
                  if (err) {
                    console.error('Error executing Python script:', err);
                fs.unlinkSync(inputPath)
                fs.unlinkSync(outputPath)

                    reject(err);
                  } else {
                    console.log('Python script execution finished');
                    conversionProgress[fileOutput] = 99

                    const blobOut = bucket.file(fileOutput);
                    const blobStreamOut = blobOut.createWriteStream();
                fs.unlinkSync(inputPath)
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
                    
                    resolve();

                  }
                });
              });
        };
        

        await executePythonScript(inputPath, outputPath);
       


      }
  
      // Send success response
      res.json({ message: 'Conversion completed successfully!' });

    } catch (error) {
      for (const file of req.files) {
        fs.unlinkSync(file.path);
    }
      console.error('Error in  route:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  });
  
  router.get('/progressTxt', (req, res) => {
    res.json({  progress:conversionProgress   });
  });


module.exports = router;
