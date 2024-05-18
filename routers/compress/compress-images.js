






const express = require('express')
const router = express.Router()
const path = require('path');
const bucket = require('../../google')
const Convert = require('../../model/convert');
const upload = require('../../multer')
const { PythonShell } = require('python-shell');



const conversionProgress = {}

const scriptPath = path.join(__dirname, '../../python/compress/compress-images.py');

  router.post('/CompressImages', upload.array('files'), async (req, res) => {
    try {
      const files = req.files;
      for (const file of files) {
        const convertType = req.body.convertType;
        const filename = req.body.filename;
        const fileOutput = req.body.fileOutput;
        const convert = new Convert({
          fileOutput: fileOutput,
          convertType: convertType,
          filename: filename,
        });
        convert.save();

console.log('convert start')
const fileNmae = Date.now()+ filename.split('_')[0]
console.log('fileNmae' , fileNmae)
console.log('convert' , convert)

        const blob = bucket.file(fileNmae)
        const blobStream = blob.createWriteStream()
        const inputPath = `https://storage.googleapis.com/${bucket.name}/${fileNmae}`

        blobStream.end(file.buffer)

        blobStream.on('finish' , async ()=>{
        conversionProgress[fileOutput] = 99

          const executePythonScript = async (inputPath, fileOutput ) => {
            return new Promise((resolve, reject) => {
                const pyShell = new PythonShell(scriptPath, { args: [inputPath, fileOutput  ] });
            
                pyShell.on('message', async (msg) => {
                  console.log(`Message from Python script: ${msg}`);
  
                });
            
                pyShell.end(async(err) => {
                  if (err) {
                    console.error('Error executing Python script:', err);
                    await bucket.file(fileNmae).delete();
  
                    reject(err);
                  } else {
                    console.log('Python script execution finished');
                    conversionProgress[fileOutput] = 100
                    await bucket.file(fileNmae).delete();
  
                    resolve();
  
                  }
                });
              });
        };
        
  
        await executePythonScript(inputPath ,  fileOutput);
  
  
       
        })
  
      
      }
  
      // Send success response
      res.json({ message: 'Conversion completed successfully!' });

    } catch (error) {
      
      console.error('Error in  route:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  });
  

  router.get('/progressCompressImages', (req, res) => {
    res.json({  progress:conversionProgress   });
  });

module.exports = router;







