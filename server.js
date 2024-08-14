const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
dotenv.config();
const fs =require('fs')
const database = require('./db/database');

const Convert = require('./model/convert');


app.use(express.json());
// app.use(express.static(path.join(__dirname, './files')));
app.use(cors());
app.use('/files', express.static(path.join(__dirname, 'files')))
database();




// from JavaScript convert
const ebook = require('./routers/convertJS/ebook')
const imagesTxt = require('./routers/convertJS/imageTxt')
const office = require('./routers/convertJS/libreoffice')
const ff = require('./routers/convertJS/ffmpeg_okly')


// from python convert 
const images_svg = require('./routers/convert/images_svg')
const imagesDocx = require('./routers/convert/imagesDocx')
const html = require('./routers/convert/html')
const micro = require('./routers/convert/micro')

// from python compress
const compressPdf = require('./routers/compress/compress-pdf')
const compressImages = require('./routers/compress/compress-images')

// from JS compress
const compressVideo = require('./routers/compresJS/compress-video')
const compressAudio = require('./routers/compresJS/compress-audio')

// from remove
const removebg = require('./routers/remove/remove')

// these for js libraries for convert

app.use('/' , ebook);
app.use('/' , imagesTxt);
app.use('/' , office);
app.use('/' , ff);
// app.use('/' , svg);




// these have python libraries for convert
app.use('/' , images_svg);
app.use('/' , imagesDocx);
app.use('/' , html);
app.use('/' , micro);


// these have python libraries for compress
app.use('/' , compressPdf);
app.use('/' , compressImages
);


// 
// these have pytJson libraries for compress
app.use('/' , compressVideo );
app.use('/' , compressAudio );


// code for remove bg
app.use('/' , removebg);








app.get('/get', async (req, res) => {
    try {
        const getConvert = await Convert.find();
        // req.session.Convert;
        res.status(200).json(getConvert);
    } catch (error) {
        console.log('Error:', error);
        // fs.unlinkSync(videoPath); // Delete the original video file
        //     fs.unlinkSync(audioPath);
        res.status(500).json({ error: 'Error fetching data' });
    }
});




app.delete('/delete/:id', async (req, res) => {
  try {

    console.log('hi')
    const id = req.params.id;
    
    // Retrieve the document first
    const convert = await Convert.findById(id);
    
    if (!convert) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const fileName = convert.fileOutput;
    const filePath = path.join(__dirname, 'files', fileName);

    // Delete the document from the database
    await Convert.findByIdAndDelete(id);

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }

        // Proceed to delete from GCS bucket here if needed

        return res.status(200).json({ message: 'File deleted successfully' });
      });
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});





app.get('/api/download', (req, res) => {
  const fileName = req.query.fileName;
  const filePath = path.join(__dirname, 'files', fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file to the client
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});



app.get('/' , (req , res)=>{
  res.send('hello update34443')
})








// real one
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;




// // Use Multer for handling file uploads
// const upload1 = multer({ storage: multer.memoryStorage() });

// app.post('/upload1', upload1.single('chunk'), (req, res) => {
//   const { chunkNumber, totalChunks, fileName  , convertType , fileOutput  , filename} = req.body;
//   const chunkIndex = parseInt(chunkNumber, 10);
//   const totalChunksCount = parseInt(totalChunks, 10);



//   // Open the file in append mode
//   const filePath = path.join(__dirname, 'files', fileName);
//   const fileDescriptor = fs.openSync(filePath, 'a');

//   // Write the chunk directly to the final file
//   fs.write(fileDescriptor, req.file.buffer, 0, req.file.buffer.length, chunkIndex * req.file.buffer.length, async (err) => {
//     if (err) {
//       fs.closeSync(fileDescriptor);
//       return res.status(500).send('Error writing chunk');
//     }

//     // Close the file descriptor after writing
//     fs.closeSync(fileDescriptor);

//     // Check if all chunks are received
//     if (chunkIndex + 1 === totalChunksCount) {
//       console.log('File uploaded successfully');
      
//       const outputPath = path.join(__dirname, 'files', fileOutput);

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

//       ffmpeg(filePath)
//         .outputFormat(outputFormat)
//         .on('progress', (progress) => {
//           // conversionProgress[fileOutput] = parseInt(progress.percent);
//         })
//         .on('error', (err) => {
//           console.error('An error occurred: ' + err.message);
//           fs.unlinkSync(filePath); // Clean up input file on error
//           res.status(500).json({ error: 'An error occurred during conversion.' });
//         })
//         .on('end', () => {
//           console.log('Conversion finished');
//           // conversionProgress[fileOutput] = 100;

//           // Cleanup after conversion
//           setTimeout(async () => {
//             if (fs.existsSync(outputPath)) {
//               fs.unlinkSync(outputPath);
//             }
//             await Convert.findOneAndDelete({ fileOutput });
//           }, 1000 * 60 * 60 * 2); // 2 hours
//         })
//         .save(outputPath);

//       res.json({ message: 'File uploaded and conversion started' });
//     } else {
//       res.send('Chunk received');
//     }
//   });
// });















const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




