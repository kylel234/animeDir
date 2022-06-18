const mongoose = require('mongoose');

// defines structure of data store in mongodb for studios
const studioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('studio', studioSchema);