const express = require('express');
const app = express();
var router = express.Router();

//tagger route
app.get('/tagger', async function (req, res) {
  //get color data based on a random image from /static/assets/aesthetic-images
  let colorData = await getPageColorInfo()
  console.log('/tagger colorData=',colorData)

  res.render('tagger', {
    //template layout to use
    layout: 'mainTemplate', 
    //page title of tab
    pageTitle: 'tagger.site',
    //page tab icon
    icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png',
    //expand projects tab
    projectsTab: 'active',
    //set active current tab
    tagger: 'active',
    //body content title 
    pageBodyNavTitle: 'Page Title',
    //body content github link
    pageBodyNavGithub: 'https://www.youtube.com/watch?v=0df7k__KEHw',
    //img path
    imgPath: colorData.imgPath,
    //img listenable bool
    imgListenable: colorData.listenable,
    //img desc
    imgDesc: colorData.desc,
    //img src
    imgSrc: colorData.src,
    //img listen
    imgListen: colorData.listen,

    /* ~~~~~~~~~~~~~~~~~~~~~
      Side-Navbar Color Data
     ~~~~~~~~~~~~~~~~~~~~~ */
    //navbar title text color
    textColor1: 'blue',   
    //navbar active tab text color
    textColor2: 'white',
    //navbar hover tab text color
    textColor3: 'pink',
    //navbar text color
    textColor6: 'brown',

    //navbar title background color
    backgroundColor1: 'red',
    //navbar tab background color
    backgroundColor2: 'yellow', //linear-gradient(90deg, {{LightVibrant}}, {{Muted}});
    //navbar active tab background color
    backgroundColor3: 'green', //linear-gradient(90deg, {{LightVibrant}}, {{LightMuted}})
    //navbar hover tab background color
    backgroundColor4: 'black',

    /* ~~~~~~~~~~~~~~~~~~~~~
      Page-Content Color Data
     ~~~~~~~~~~~~~~~~~~~~~ */
    //page body background color
    backgroundColor5: 'white',
    //page body title background color
    backgroundColor6: 'pink',

    //page body title text color
    textColor4: 'green',
    //page body text color
    textColor5: 'red',
    

    //img color display boxes
    Vibrant: colorData.colors['Vibrant'],
    LightVibrant: colorData.colors['LightVibrant'],
    DarkVibrant: colorData.colors['DarkVibrant'],
    Muted: colorData.colors['Muted'],
    LightMuted: colorData.colors['LightMuted'],
    DarkMuted: colorData.colors['DarkMuted'],
    
    
  });
})

//discogstagger routes
app.get('/discogstagger', async function(req, res){
  let colorData = await getPageColorInfo()
  res.render('discogstagger', {
    layout : 'newHomeindex',
    pageTitle: 'discogstagger.site',
    projectsTab:'active',
    icon: '/static/assets/img/discogstagger.png',
    //color Data
    Vibrant: colorData.colors['Vibrant'],
    LightVibrant: colorData.colors['LightVibrant'],
    DarkVibrant: colorData.colors['DarkVibrant'],
    Muted: colorData.colors['Muted'],
    LightMuted: colorData.colors['LightMuted'],
    DarkMuted: colorData.colors['DarkMuted'],
    imgPath: colorData.imgPath,
  });
});

//nodejs virbant color picker extension
var Vibrant = require('node-vibrant')

//api route to return pageColors
app.post('/getColors', async function (req, res) {
  //let filepath = req.body.filepath
  console.log("/getColors")
  let colorData = await getPageColorInfo()
  res.send(colorData)
});

//return pageColors
async function getPageColorInfo() {
  return new Promise(async function (resolve, reject) {
    let randomImg = await getRandomImg('static/assets/aesthetic-images/')
    let imgPath = `static/assets/aesthetic-images/${randomImg}`

    //get color swatches
    var swatches = await Vibrant.from(imgPath).getPalette()
    //format rbg and swatch type into list
    let colors = {}
    for (const [key, value] of Object.entries(swatches)) {
      //get rgb color value
      let colorValue = value.rgb
      //convert to hex color value
      let hexColor = rgbToHex(colorValue)
      //construct object
      var keyName = `${key}`
      colors[keyName] = hexColor
    }

    //get source info
    let sourceInfo = await getSourceInfo(randomImg)

    resolve({ 
      colors: colors, 
      imgPath: imgPath, 
      filename: randomImg, 
      listenable: sourceInfo.listenable, 
      desc: sourceInfo.desc, 
      src: sourceInfo.src,
      listen: sourceInfo.listen,
    })
  })
}

//convert rgb string to hex
function rgbToHex(color) {
  return "#" + componentToHex(parseInt(color[0])) + componentToHex(parseInt(color[1])) + componentToHex(parseInt(color[2]));
}

//convert to int to hex
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

//get img source info
function getSourceInfo(imgFilename){
  
  return new Promise(async function (resolve, reject) {
    
    //remove filetype at end
    imgFilename = imgFilename.substring(0, imgFilename.indexOf('.'))

    let imgSources = {
      'beatgeneration':{
        'desc':'This album is not availiable online anywhere.',
        'src':'https://www.discogs.com/John-Brent-Len-Chandler-Hugh-Romney-Beat-Generation-Vol-I/release/12692463',
        'listenable':false,
      },
      
      'folkwaysMexico':{
        'listen':'https://www.youtube.com/embed/hsolGtuwvYU',
        'listenable':true,
      },

      'JohnBerkey':{
        'desc':'John Berkey',
        'listenable':false,
      },
      
      '':{
        'desc':'',
        'listenable':true,
      },
      
    }

    resolve(imgSources[imgFilename])
  })
}

//return random image filename from path
function getRandomImg(path) {
  return new Promise(async function (resolve, reject) {
    var fs = require('fs');
    var files = fs.readdirSync('static/assets/aesthetic-images/')
    /* now files is an Array of the name of the files in the folder and you can pick a random name inside of that array */
    let chosenFile = files[Math.floor(Math.random() * files.length)]
    resolve(chosenFile)
  })
}

module.exports = app;


/*
router.get('/newHome/tagger', function(req, res) {
  res.render('newtagger', {
    layout : 'newHomeindex',
    pageTitle: 'tagger.site',
    projectsTab:'active',
    icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png'
  });
})


*/


//app.use(router);
//app.listen(3000);

//app.post('/getColors', function (req, res) {
 // res.send('about')
//})

/*

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

*/

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
