const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');

// all studio route
router.get('/', async (req, res) => {
    let searchOptions = {}
    // check if there's actually a name passed to server
    if (req.query.name != null && req.query.name !== '') {
        // case insensitive and provides studios based on search
      searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const studios = await Studio.find(searchOptions)
      res.render('studios/index', {
        studios: studios,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
  })

// new route for anime
router.get('/new', (req, res) => {
    res.render('studios/new', {studio: new Studio()});
});

// Create route for anime
router.post('/', async (req, res) => {
    const studio = new Studio({
        name: req.body.name // explicity tells server params we want for studio
    })
    try {
        const newStudio = await studio.save()
        //res.redirect(`studios/${newStudio.id}`)
        res.redirect(`studios`)
    } catch {
        res.render('studios/new', {
            studio: studio,
            errorMessage: 'Error creating studio'
        })
    }
});

module.exports = router;