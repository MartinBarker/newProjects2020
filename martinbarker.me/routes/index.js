var express = require('express');
var router = express.Router();

//new home routes
router.get('/newHome', (req, res) => {
  res.render('newhome', {  //page specific body contents 
      layout : 'newHomeindex',  //index [outside generic code: navbar/ads/SEO/accessibility]
      pageTitle: 'tagger.site', 
      icon: '/static/assets/img/home.png', 
      homePage:'active',
  });
});

//new tagger home route
router.get('/newHome/tagger', (req, res) => {
  res.render('newtagger', {
    layout : 'newHomeindex', 
    pageTitle: 'tagger.site',
    projectsTab:'active',
    icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png'
  });
});
// default normal routes

//home page route
router.get('/', (req, res) => {
    res.render('home', {
        layout : 'index', 
        pageTitle: 'martinbarker.me', 
        icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png', 
        expandProjects: 'active',
        activeTagger: 'active'
    });
});

//tagger home route
router.get('/tagger',function(req, res){    
    res.render('tagger', {
      layout : 'index', 
      pageTitle: 'tagger.site',
      projectsTab:'active',
      icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png'
    });
  });

//discogstagger routes
router.get('/discogstagger',function(req, res){    
    res.render('discogstagger', {
      layout : 'index', 
      pageTitle: 'discogstagger.site',
      projectsTab:'active',
      icon: '/static/assets/img/discogstagger.png'
    });
  });

/*
//projects page
router.get('/projects', (req, res) => {
    res.render('projects', {
        layout : 'index',
        pageTitle: 'projects',
        icon: '/static/assets/img/projects.png', 
        projectsTab:'active'
    });
});

//tagger routes
router.use('/tagger', require('./taggerRoutes').router);

router.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});
*/
module.exports = router;