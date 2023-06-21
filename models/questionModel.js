const mongoose = require('mongoose')

const questionSchama = mongoose.Schema({
    level: {type: Number, required: true},
    question: {type: String, required: true},
    opt1: {type: String, required: true},
    opt2: {type: String, required: true},
    opt3: {type: String, required: true},
    opt4: {type: String, required: true},
    answer: {type: String, required: true}
},{timestamps: true})

module.exports = mongoose.model('Question', questionSchama)