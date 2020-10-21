const mongoose = require('mongoose');
const moment = require('moment');

const WordSchema = new mongoose.Schema({
    word: {type: String, required: true, lowercase: true, unique: true},
    meaning: {type: String, required: true, lowercase: true, trim: true},
    date: {
        type: String,
        default: () => moment().format('dddd, MMMM, Do YYYY, h:mm a')
    },

    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('word', WordSchema);