const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const Anime = require('../models/anime')

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

// new route for studio
router.get('/new', (req, res) => {
    res.render('studios/new', {studio: new Studio()});
});

// Create route for studio
router.post('/', async (req, res) => {
    const studio = new Studio({
        name: req.body.name // explicity tells server params we want for studio
    })
    try {
        const newStudio = await studio.save()
        res.redirect(`studios/${newStudio.id}`)
        //res.redirect(`studios`)
    } catch {
        res.render('studios/new', {
            studio: studio,
            errorMessage: 'Error creating studio'
        })
    }
});

// show route
router.get('/:id', async (req, res) =>{
  try {
    const studio = await Studio.findById(req.params.id) 
    const animes = await Anime.find({studio: studio.id}).limit(10).exec() // finds anime and limits to showing 10 
    res.render('studios/show', {
      studio: studio,
      animesByStudio: animes
    })
  } catch {
    res.redirect('/') // redirects to home page if studio not found
  }
})

// edit route
router.get('/:id/edit', async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id) // finds user by id
    res.render('studios/edit', {studio: studio}); 
  } catch {
    res.redirect('/')
  }
})

// update route
router.put('/:id', async (req, res) => {
  let studio
try {
    studio = await Studio.findById(req.params.id)
    studio.name = req.body.name // new name you want to update  
    await studio.save() // saves new studio
    res.redirect(`/studios/${studio.id}`) // redirects to studios/studio id, studios showpage
} catch {
    if (studio == null) {
      res.redirect('/') // check if no studio is find and if not redirect to home page
    } else {
      res.render('studios/edit', {
        studio: studio,
        errorMessage: 'Error updating studio'
    })
  }
}
})

// delete route
router.delete('/:id', async (req, res) => {
  let studio
try {
    studio = await Studio.findById(req.params.id)
    await studio.remove() // removes current studio
    res.redirect(`/studios`) // redirects to studios/studio id, studios showpage
} catch {
    if (studio == null) {
      res.redirect('/') // check if no studio is find and if not redirect to home page
    } else {
      res.redirect(`/studios/${studio.id}`)
  }
}
})

module.exports = router;