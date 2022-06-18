const mongoose = require('mongoose');
const path = require('path');
const posterImageBasePath = 'uploads/animePoster'

// defines structure of data store in mongodb for animes
const animeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    dateAired: {
        type: Date,
        required: true
    },
    episodeCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    animeImageName: {
        type: String,
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId, // references another object 
        required: true,
        ref: 'studio' // matches studio name used in studio model
    }
});

animeSchema.virtual('posterImagePath').get(function() {
    // checks if there is a poster image and if so get the path to it
    if (this.animeImageName != null) {
        return path.join('/', posterImageBasePath, this.animeImageName)
    }
})

module.exports = mongoose.model('anime', animeSchema);
module.exports.posterImageBasePath = posterImageBasePath;