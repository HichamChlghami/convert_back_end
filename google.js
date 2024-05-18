const { Storage } = require('@google-cloud/storage');


const storage = new Storage({
    keyFilename:'sitfile.json'
})


const bucketName = 'sitfile'; // Replace with your GCS bucket name
const bucket = storage.bucket(bucketName);


module.exports = bucket
