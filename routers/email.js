const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


const multer = require('multer');


const upload = multer();
// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: 'chlghamihicham@gmail.com', // Your email
        pass: 'Hicham9Move' // Your email password or app password
    }
});

router.post('/email',upload.none(), (req, res) => {
    const { name, phone, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'recipient-email@example.com',
        subject: 'New Message from Contact Form',
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});



module.exports = router;

