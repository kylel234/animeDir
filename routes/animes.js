const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const Studio = require('../models/studio');
const path = require('path');
const fs = require('fs'); // file system, helps delete anime we dont need
const uploadPath = path.join('public', Anime.posterImageBasePath); // gets the upload path written in models anime.js
const multer = require('multer');
const imgTypes = ['image/jpeg', 'image/png', 'image/gif'] // array of image types our app will support when uploading poster
const upload = multer({ // multer helps upload files
  dest: uploadPath,
  fileFileter: (req, file, callback) => { // filters through files
    callback(null, imgTypes.includes(file.mimetype));
  }
});

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
router.post('/', upload.single('poster'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null; // checks if filename is found and stores in fileName
  const anime = new Anime({
    title: req.body.title,
    studio: req.body.studio,
    dateAired: new Date(req.body.dateAired),
    episodeCount: req.body.episodeCount,
    animeImageName: fileName,
    description: req.body.description
  })

  try {
    const newAnime = await anime.save();
    res.redirect(`animes`);
  } catch {
    if (anime.animeImageName != null) {
      removeAnimePoster(anime.animeImageName);
    }
    renderNewPage(res, anime, true);
  }
});

function removeAnimePoster(filename) {
  fs.unlink(path.join(uploadPath, filename), err => {
    if (err) {
      console.log(err);
    }
  });
}

async function renderNewPage(res, anime, hasError = false) {
  try {
    const studios = await Studio.find({});
    const params = {
      studios: studios, 
      anime: anime
    }
    if (hasError) {
      params.errorMessage = "Error creating anime";
    }
    res.render('animes/new', params);
  } catch {
    res.redirect('/animes');
  }
}

module.exports = router;