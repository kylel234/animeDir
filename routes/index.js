const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');

// display recently added animes
router.get('/', async (req, res) => {
    let animes
    try {
        animes = await Anime.find().sort({createAt: 'desc'}).limit(10).exec()
    } catch {
        animes = []
    }
    res.render('index', {animes: animes});
});

module.exports = router;