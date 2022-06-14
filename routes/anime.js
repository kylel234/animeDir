const express = require('express');
const router = express.Router();

// all anime route
router.get('/', (req, res) => {
    res.render('anime/index', {title: "myAnime! sadasd"});
});

// new route for anime
router.get('/new', (req, res) => {
    res.render('anime/new');
});

// Create route for anime
router.post('/', (req, res) => {
    res.send('Create');
});

module.exports = router;