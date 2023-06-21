const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    name: String,
    contact: String,
    message: String
},
{timestamps: true})

module.exports = mongoose.model('Message', messageSchema)
