const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
dotenv.config();

const database = require('./db/database');
const bucket = require('./google')

const Convert = require('./model/convert');

// from JavaScript convert
const ebook = require('./routers/convertJS/ebook')
const imagesTxt = require('./routers/convertJS/imageTxt')
const office = require('./routers/convertJS/libreoffice')
const ff = require('./routers/convertJS/ffmpeg_okly')

// from python convert 
const images_svg = require('./routers/convert/images_svg')
const svg = require('./routers/convert/svg')
const imagesDocx = require('./routers/convert/imagesDocx')
const html = require('./routers/convert/html')
const txt = require('./routers/convert/txt')
const micro = require('./routers/convert/micro')

// from python compress
const compressPdf = require('./routers/compress/compress-pdf')
const compressImages = require('./routers/compress/compress-images')

// from JS compress
const compressVideo = require('./routers/compresJS/compress-video')
const compressAudio = require('./routers/compresJS/compress-audio')




// const upload = require('./multer')
// const { PythonShell } = require('python-shell');



app.use(express.json());
// app.use(express.static(path.join(__dirname, './files')));
app.use(cors());

database();
// // these for js libraries for convert

app.use('/' , ebook);
app.use('/' , imagesTxt);
app.use('/' , office);
app.use('/' , ff);



// these have python libraries for convert
app.use('/' , images_svg);
app.use('/' , svg);
app.use('/' , imagesDocx);
app.use('/' , html);
app.use('/' , txt);
app.use('/' , micro);


// these have python libraries for compress
app.use('/' , compressPdf);
app.use('/' , compressImages
);


// 
// these have pytJson libraries for compress
app.use('/' , compressVideo );
app.use('/' , compressAudio );










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
      const id = req.params.id;
      const convert = await Convert.findByIdAndDelete(id);
      const fileName = convert.fileOutput;
  if(fileName){
    await bucket.file(fileName).delete();
    console.log('we are deleting GCS')

  }
  console.log('we are deleting DB')

      // Delete from GCS bucket
  
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });


app.get('/api/download', async (req, res) => {
    try {
      const fileName = req.query.fileName; // Retrieve the file name from the query string
      const blob = bucket.file(fileName);
      const blobStream = blob.createReadStream();
      blobStream.pipe(res);
    //  console.log('clo' , clo)
  
    } catch (error) {
      console.error('Error downloading file:', );
      return res.status(500).send('Internal server error');
    }
  });
  






// this for url public
// app.post('/x', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;
//         const fileUrls = []; // Array to store public URLs of uploaded files
//         for (const file of files) {
//             const convertType = req.body.convertType;
//             const filename = req.body.filename;
//             const fileOutput = req.body.fileOutput;
//             const convertly = new Convert({
//                 fileOutput,
//                 convertType,
//                 filename,
//             });
//             await convertly.save();

//             const fileName = fileOutput;
//             if (!file) {
//                 res.status(400).send("file does not exist");
//                 return;
//             }
//             const blob = bucket.file(fileName);
//             const blobStream = blob.createWriteStream({
//                 metadata: {
//                     contentType: file.mimetype
//                 }
//             });

//             blobStream.on('error', (err) => {
//                 console.log('error', err);
//                 res.status(500).send("Error occurred during file upload");
//             });

//             blobStream.on('finish', async () => {
//                 console.log('File uploaded successfully');
//                 // Construct public URL for the uploaded file
//                 const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//                 fileUrls.push(publicUrl); // Push public URL to the array
//                 if (fileUrls.length === files.length) {
//                     // If all files have been uploaded, send the array of URLs as response
//                     res.json({ message: 'Videos converted successfully!', fileUrls });
//                     console.log('publicUrl' , publicUrl)
//                 }

//             });

//             blobStream.end(file.buffer);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });







// app.get("/download/:filename" , async(req , res) => {
//     const filename = req.params.filename;
//     const file = bucket.file(filename);
    
//     try {
//         const [exists] = await file.exists();
//         if (!exists) {
//             res.status(404).send('File not found');
//             return;
//         }
// else{
//     const signedUrl = await file.getSignedUrl({
//         action: 'read',
//         expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//     });

//     res.json({ url: signedUrl[0] });

//     console.log('signedUrl',signedUrl)
// }
        


//         const localFilePath = `${fileOutput}`
//         const xly   =  await file.download({ destination: localFilePath });
//         console.log('xly' , xly)
//     //    const  deletely =   await bucket.file(filename).delete()
//         // console.log('deletely' , deletely)
//         // // const [signedUrl] = await file.getSignedUrl({
//         // //     action: 'read',
//         // //     expires: Date.now() + 120 * 60 * 1000
//         // // });
//         // // res.header('Content-Disposition', `attachment; filename="${filename}"`);
//         // await bucket.file(filename).download()

//         // res.redirect(signedUrl);








//     } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// app.listen(8000, () => {
//     console.log('The server is running on port 8000');
// });





















// // backend/server.js
// const express = require('express');
// const app = express();

// const upload = require('./multer');
// const bucket = require('./google');

// // const { Storage } = require('@google-cloud/storage');
// const cors = require('cors'); // Import the cors package
// app.use(cors());
// app.use(express.json());

// // const storage = new Storage({
// //     keyFilename:'sitfile.json'
// // })
// // Multer configuration for file upload
// // const upload = multer({
// //   storage: multer.memoryStorage()
// // });
// // const bucketName = 'sitfile'

// // Google Cloud Storage configuration
// // const bucketName = 'z23'; // Replace with your GCS bucket name
// // const bucket = storage.bucket(bucketName);

// // Handle file upload
// // app.post('/api/upload', upload.single('file'), async (req, res) => {
// //   try {
// //     const file = req.file;
// //     if (!file) {
// //       return res.status(400).send('No file uploaded');
// //     }
// //     const blob = bucket.file('hicham3.png');
// //     const blobStream = blob.createWriteStream();
// //     blobStream.end(file.buffer);
// //     return res.status(200).send('File uploaded successfully');
// //   } catch (error) {
// //     console.error('Error uploading file:', error);
// //     return res.status(500).send('Internal server error');
// //   }
// // });












// // const ffmpeg = require('fluent-ffmpeg');

// // // const path = require('path');

// // app.post('/api/upload', upload.single('file'), async (req, res) => {
// //     try {
// //         const file = req.file;
// //         if (!file) {
// //             return res.status(400).send('No file provided');
// //         }
// //         console.log('start')
// //         const outputFileName = 'output_file1.mp3';
// //         const outputFilePath = './hello.mp3' // Use absolute path
// //         // const outputFilePath = path.join(__dirname, '../convert_front/public/hellow21.mp3');

// //         ffmpeg(file.buffer)
// //             .output(outputFilePath)
// //             .on('end', function() {
// //                 console.log('Conversion finished');

// //                 // Read the converted file after conversion is finished
// //                 const convertedFileBuffer = fs.readFileSync(outputFilePath);
                
// //                 // Upload converted file to Google Cloud Storage
// //                 const convertedBlob = bucket.file(outputFileName);
// //                 const convertedBlobStream = convertedBlob.createWriteStream();
// //                 convertedBlobStream.end(convertedFileBuffer);
                
// //                 return res.status(200).send('File uploaded and converted successfully');
// //             })
// //             .on('error', function(err) {
// //                 console.error('Error during conversion: ' + err);
// //                 return res.status(500).send('Error during conversion');
// //             })
// //             .run();

// //     } catch (error) {
// //         console.error('Error uploading file:', error);
// //         return res.status(500).send('Internal server error');
// //     }
// // });



// // const fs = require('fs');
// // this use for  local output and send 
// const ffmpeg = require('fluent-ffmpeg');

// // app.post('/api/upload', upload.single('file'), async (req, res) => {
// //   try {
// //     const file = req.file
// //       if (!req.file) {
// //           return res.status(400).send('No file provided');
// //       }
// //       console.log('start')
// // const  fileName = 'file.mp4'
// //  // FFmpeg command for converting video to audio
// //  const outputFileName = 'output_file1.mp3';
// //  const outputPath = path.join(__dirname, '../convert_front/public', outputFileName);

// //       const blob = bucket.file(fileName);
// //       const blobStream = blob.createWriteStream();
// //       blobStream.on('finish' , ()=>{
// //         console.log('finished upload')
// //       })
      
// //       // Write JPEG buffer to stream
     
// //       blobStream.on('finish', async () => {
// //         // Retrieve original file from GCS
// //         // const originalFile = bucket.file(fileName);
// //         // const [originalFileData] = await originalFile.download();
// //         const gcsFileName = 'hellow.mp3'; // Corrected filename
// //     const gcsFile = bucket.file(gcsFileName);
// //     const gcsStream = gcsFile.createWriteStream();
// //       ffmpeg('https://storage.googleapis.com/xz1/filelo.mp4')
// //         .output(outputPath)
// //         .on('progress', (progress) => {
// //             // Update the progress value
// //             const conversionP = parseInt(progress.percent)
// //             console.log('Conversion progress:', conversionP);
// //         })
// //         .on('end', function () {
// //             console.log('Conversion finished');
// //             res.status(200).send('File converted successfully');
// //             const jpegBlob = bucket.file('hellow.mp3'); // Corrected filename
// //             const jpegBlobStream = jpegBlob.createWriteStream();
// //             jpegBlobStream.on('finish', () => {
      
// //               console.log('finishjpegBlobStream')
// //           });
// //     // jpegBlobStream.end(outputPath.buffer);
// //     const localReadStream = fs.createReadStream(outputPath);
// //         localReadStream.pipe(jpegBlobStream);


// //         })
// //         .on('error', function (err) {
// //             console.error('Error during conversion:', err);
// //             res.status(500).send('Error during conversion');
// //         })
// //         .run();
        




// //         // Create writable stream for JPEG

// //     });
    
// //     blobStream.end(gcsStream.buffer);



     
    
// //   } catch (error) {
// //       console.error('Error uploading file:', error);
// //       return res.status(500).send('Internal server error');
// //   }
// // });




// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   try {
//     const file = req.file
//       if (!req.file) {
//           return res.status(400).send('No file provided');
//       }
//       console.log('start file' , file)
// const  fileName = 'file43.mp4'
//  // FFmpeg command for converting video to audio
//  const outputFileName = 'output_file_execl.mp3';
//  const outputPath = path.join(__dirname, './routers', outputFileName);


 
//       const blob = bucket.file(fileName);
//       const blobStream = blob.createWriteStream();
    
      


//       // Write JPEG buffer to stream
     
//       blobStream.on('finish', async () => {
    
//       ffmpeg('https://storage.googleapis.com/xz1/filelo.mp4')
//         .output(outputPath)
//         .on('progress', (progress) => {
//             // Update the progress value
//             const conversionP = parseInt(progress.percent)
//             console.log('Conversion progress:', conversionP);
//         })
//         .on('end', function () {
//             console.log('Conversion finished');
//             res.status(200).send('File converted successfully');
//             const jpegBlob = bucket.file('hellow.mp3'); // Corrected filename
//             const jpegBlobStream = jpegBlob.createWriteStream();
//             jpegBlobStream.on('finish', () => {
      
//               console.log('finishjpegBlobStream')
//           });
//     // jpegBlobStream.end(outputPath.buffer);
//     const localReadStream = fs.createReadStream(outputPath);
//         localReadStream.pipe(jpegBlobStream);


//         })
//         .on('error', function (err) {
//             console.error('Error during conversion:', err);
//             res.status(500).send('Error during conversion');
//         })
//         .run();
        




//         // Create writable stream for JPEG

//     });
    
//     blobStream.end(file.buffer);



     
    
//   } catch (error) {
//       console.error('Error uploading file:', error);
//       return res.status(500).send('Internal server error');
//   }
// });
















































// // app.get('/api/download', async (req, res) => {
// //   try {
// //     const fileName = req.query.fileName; // Retrieve the file name from the query string
// //     const blob = bucket.file(fileName);
// //     const blobStream = blob.createReadStream();
// //    const clo =  blobStream.pipe(res);
// //    console.log('clo' , clo)

// //   } catch (error) {
// //     console.error('Error downloading file:', error);
// //     return res.status(500).send('Internal server error');
// //   }
// // });






const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




