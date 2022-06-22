const mongoose = require('mongoose');
const Anime = require('./anime') // get anime.js in models

// defines structure of data store in mongodb for studios
const studioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// makes sure that animes associated with that studio arent deleted if the studio is
studioSchema.pre('remove', function(next) {
    Anime.find({ studio: this.id}, (err, animes) => {
        if (err) {
            next(err)
            // checks if anime is in db, if studio has anime then prevents studio from being deleted  if so
        } else if (animes.length > 0) {
            next(new Error('This studio has anime'))
            // if not then ok to remove studio
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('studio', studioSchema);