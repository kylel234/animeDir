const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const Studio = require('../models/studio');
//const path = require('path');
//const fs = require('fs'); // file system, helps delete anime we dont need
//const uploadPath = path.join('public', Anime.posterImageBasePath); // gets the upload path written in models anime.js
//const multer = require('multer');
const imgTypes = ['image/jpeg', 'image/png', 'image/gif'] // array of image types our app will support when uploading poster
/*const upload = multer({ // multer helps upload files
  dest: uploadPath,
  fileFileter: (req, file, callback) => { // filters through files
    callback(null, imgTypes.includes(file.mimetype));
  }
});*/

// all anime route
router.get('/', async (req, res) => {
  let query = Anime.find()
  // search for books through search bar
  // checks for title
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  // checks if the aired date is before
  if (req.query.airedBefore != null && req.query.airedBefore != '') {
    query = query.lte('dateAired', req.query.airedBefore)
  }
  // checks if aired date is after
  if (req.query.airedAfter != null && req.query.airedAfter != '') {
    query = query.gte('dateAired', req.query.airedAfter)
  }
  try {
    const animes = await query.exec()
    res.render('animes/index', {
      animes: animes,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
});

// new route for anime
router.get('/new', async (req, res) => {
  renderNewPage(res, new Anime());
});

// Create route for anime
router.post('/', async (req, res) => {
  //const fileName = req.file != null ? req.file.filename : null; // checks if filename is found and stores in fileName
  const anime = new Anime({
    title: req.body.title,
    studio: req.body.studio,
    dateAired: new Date(req.body.dateAired),
    episodeCount: req.body.episodeCount,
    description: req.body.description
  })
  saveImg(anime, req.body.poster)
    
  try {
    const newAnime = await anime.save();
    res.redirect(`animes/${newAnime.id}`);
  } catch {
    /*if (anime.animeImageName != null) {
      removeAnimePoster(anime.animeImageName);
    }*/
    renderNewPage(res, anime, true);
  }
});

/*function removeAnimePoster(filename) {
  fs.unlink(path.join(uploadPath, filename), err => {
    if (err) {
      console.log(err);
    }
  });
}*/

// show page route
router.get('/:id', async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id).populate('studio').exec() // populates anime object with info about the studio
    res.render('animes/show', {anime: anime})
  } catch {
    res.redirect('/')
  }
})

// edit anime route
router.get('/:id/edit', async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id)
    renderEditPage(res, anime);
  } catch {
    res.redirect('/')
  }
});

// update anime route
router.put('/:id', async (req, res) => {
  let anime
  try {
    anime = await Anime.findById(req.params.id)
    // allows user to edit features of anime
    anime.title = req.body.title
    anime.studio = req.body.studio
    anime.dateAired = new Date(req.body.dateAired)
    anime.episodeCount = req.body.episodeCount
    anime.description = req.body.description
    // makes sure cover exists so as to not accidentally delete instead override it
    if (req.body.poster != null && req.body.poster !== '') {
      saveImg(anime, req.body.poster)
    }
    await anime.save() // save this updated anime
    res.redirect(`/animes/${anime.id}`); // redirects to show page of the book
  } catch(errorMessage) {
    if (anime != null) {
      console.log(errorMessage)
      renderEditPage(res, anime, true) // renders edit page again with error message
    } else {
      res.redirect('/') // cant get anime, go to home page
    }
  }
});

// delete anime page route
router.delete('/:id', async (req, res) => {
  let anime
  try {
    anime = await Anime.findById(req.params.id)
    await anime.remove()
    res.redirect('/animes')
  } catch {
    if (anime != null) {
      res.render('animes/show', {
        anime: anime,
        errorMessage: 'Could not remove'
      })
    } else {
      res.redirect('/')
    }
  }
})

// saves img of anime in db
function saveImg(anime, posterEncoded) {
  // check poster is not null and is valid
  if (posterEncoded == null) return 
  const poster = JSON.parse(posterEncoded)
  // checks if poster is valid with valid img type 
  if (poster != null && imgTypes.includes(poster.type)) {
    anime.animeImage = new Buffer.from(poster.data, 'base64')
    anime.imgType = poster.type
  }
}

async function renderNewPage(res, anime, hasError = false) {
  renderFormPage(res, anime, 'new', hasError)
}

async function renderEditPage(res, anime, hasError = false) {
  renderFormPage(res, anime, 'edit', hasError)
}

async function renderFormPage(res, anime, form, hasError = false) {
  try {
    const studios = await Studio.find({});
    const params = {
      studios: studios, 
      anime: anime
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = "Error editing anime"
      } else {
        params.errorMessage = "Error creating anime";
      } 
    }
    res.render(`animes/${form}`, params);
  } catch {
    res.redirect('/animes');
  }
}

module.exports = router;