const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('we start multering')
        cb(null, './files');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
       


    }
});

const upload = multer({ storage: storage });
module.exports = upload

