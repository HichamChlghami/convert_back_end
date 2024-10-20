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



// app.use('/images', express.static(path.join(__dirname, 'images')));

// app.get('/image-list', (req, res) => {
//   const imagesFolder = path.join(__dirname, 'images');

//   fs.readdir(imagesFolder, (err, files) => {
//     if (err) {
//       return res.status(500).json({ error: 'Unable to scan directory' });
//     }
//     res.json(files);
//   });
// });


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
// const color =  require('./routers/design/color')
// these for js libraries for convert

// from  user
const users = require('./routers/user/user')

// from payment
const payment = require('./routers/payment/pay')
const cancelPayment = require('./routers/payment/cancel_payment')





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
// app.use('/' , color);



// this for users
app.use('/' , users);

// this for payment
app.use('/' , payment);
app.use('/' , cancelPayment);






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
    console.log('hi');
    const id = req.params.id;

    // Retrieve the document first
    const convert = await Convert.findById(id);

    if (!convert) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const fileName = convert.fileOutput;
    const filePath = path.join(__dirname, 'files', fileName);

    // Delete the document from the database
    // await Convert.findByIdAndDelete(id);

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);

      // Proceed to delete from GCS bucket here if needed

      return res.status(200).json({ message: 'File deleted successfully' });
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
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
  res.send('hello updated4')
})








// that use for  send email
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Use the email service you prefer
//   auth: {
//       user: 'chlghamihicham@gmail.com', // Your email
//       pass: 'xhcx cgwd eifo yirg', // Your email password or app password
//   },
// });

// app.post('/email', (req, res) => {
//   const { name,email, phone, message } = req.body;

//   const mailOptions = {
//       from: 'chlghamihicham@gmail.com',
//       to: 'webhive336@gmail.com',
//       subject: 'New Message from tospread.com',
//       name:name,
//       email:email,
//       phone:phone,
//       text: message,
//   };
//   console.log('send good',mailOptions )



//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           // return res.status(500).send(error.toString());
//           console.log( 'error'  ,  error.message)
//       }
//       res.status(200).send('Email sent: ' + info.response);
// console.log('message' ,  info.response)

//   });
// });

































































const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


















