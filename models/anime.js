const mongoose = require('mongoose');
//const path = require('path');
//const posterImageBasePath = 'uploads/animePoster'

// defines structure of data stored in mongodb for animes
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
    animeImage: {
        type: Buffer,
        required: true
    },
    imgType: {
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
    // checks if there is a poster image and if so gets proper string for img src
    if (this.animeImage != null && this.imgType != null) {
        //return path.join('/', posterImageBasePath, this.animeImageName)
        // returns proper string for anime img for img src
        return `data:${this.imgType};charset=utf-8;base64,${this.animeImage.toString('base64')}`
    }
})

module.exports = mongoose.model('anime', animeSchema);
//module.exports.posterImageBasePath = posterImageBasePath;