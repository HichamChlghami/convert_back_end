
// // this code for convert devices good convert to devices
// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');
// const upload = require('../../multer');
// const Convert = require('../../model/convert');

// const conversionProgress = {};

// router.post('/device', upload.array('files'), async (req, res) => {
//     try {
//         const files = req.files;
//         for (const file of files) {
//             const convertType = req.body.convertType;
//             const filename = req.body.filename;
//             const videoPath = file.path;
//             const fileOutput = req.body.fileOutput;

//             const convertedVideoPath = path.join(__dirname, '../../../convert_front/public', fileOutput + '.android.mp4'); // Append '.android.mp4' for Android format
//             const convert = new Convert({
//                 fileOutput: fileOutput,
//                 convertType: convertType,
//                 filename: filename,
//             });
//             convert.save();

//             console.log(convertedVideoPath);
//             console.log(fileOutput);
//             console.log(convertType);

//             ffmpeg(videoPath)
//             .outputOptions('-c:v', 'libx264') // Use H.264 video codec
//             .outputOptions('-c:a', 'aac') // Use AAC audio codec
//             .outputOptions('-strict', 'experimental') // Necessary for some AAC codec parameters
//             .outputOptions('-pix_fmt', 'yuv420p') // Ensure pixel format compatibility
//             .output(convertedVideoPath)
//                 .on('progress', (progress) => {
//                     // Update the progress value
//                     conversionProgress[fileOutput] = parseInt(progress.percent);
//                 })
//                 .on('end', function () {
//                     console.log('Conversion finished');
//                     // Remove the progress entry for this file once conversion is completed
//                     conversionProgress[fileOutput] = 100
//                 })
//                 .on('error', function (err) {
//                     console.error('Error during conversion: ' + err);
//                     // Remove the progress entry for this file due to error
//                     delete conversionProgress[fileOutput];

//                     // Delete the original video file if it exists
//                     if (fs.existsSync(videoPath)) {
//                         fs.unlinkSync(videoPath);
//                     }

//                     // Delete the potentially created converted video file if it exists
//                     if (fs.existsSync(convertedVideoPath)) {
//                         fs.unlinkSync(convertedVideoPath);
//                     }
//                 })
//                 .run();
//         }

//         res.json({ message: 'Videos converted successfully!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//         // If an error occurs, make sure to clean up by deleting uploaded files
//         for (const file of req.files) {
//             fs.unlinkSync(file.path);
//         }
//     }
// });

// router.get('/progressDevice', (req, res) => {
//     res.json({ progress: conversionProgress });
// });

// module.exports = router;












