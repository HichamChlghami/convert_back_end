// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const Convert = require('../../model/convert');
// const { PythonShell } = require('python-shell');
// const fs = require('fs');
// const path = require('path');

// const upload = multer(); // Initialize multer

// const scriptPath = path.join(__dirname, '../../python/design/color.py');

// router.post('/color', upload.none(), async (req, res) => {
//     const { fileOutput, color } = req.body;
//     console.log('fileOutput:', fileOutput);
//     console.log('color:', color);

//     // Validate input
//     if (!fileOutput || !color) {
//         return res.status(400).json({ error: 'fileOutput and color are required' });
//     }

//     const outputPath = path.join(__dirname, '../../files', fileOutput);
//     const inputPath = color;

//     const executePythonScript = async (inputPath, outputPath) => {
//         return new Promise((resolve, reject) => {
//             console.log('Executing Python script');

//             const pyShell = new PythonShell(scriptPath, { args: [inputPath, outputPath] });

//             pyShell.on('message', (msg) => {
//                 console.log(`Message from Python script: ${msg}`);
//             });

//             pyShell.end(async (err) => {
//                 if (err) {
//                     console.error('Error executing Python script:', err);
//                     reject(err);
//                 } else {
//                     console.log('Python script execution finished');
//                     resolve();
//                 }
//             });
//         });
//     };

//     try {
//         await executePythonScript(inputPath, outputPath);
//     } catch (err) {
//         console.error('Python script failed:', err);
//         return res.status(500).json({ error: 'Python script failed', message: err.message });
//     }

//     res.json({ message: 'Files converted successfully!' });
// });

// module.exports = router;
