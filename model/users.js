const mongoose = require('mongoose');

const users = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    payer: Boolean,  
    subscriber: String,  
});

module.exports = mongoose.model("user", users);
