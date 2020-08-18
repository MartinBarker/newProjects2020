const express = require('express');
const app = express();
var router = express.Router();

//tagger route
app.get('/tagger', async function (req, res) {
  //get color data based on a random image from /static/assets/aesthetic-images
  let colorData = await getPageColorInfo()
  console.log('/tagger imgListenable = ', colorData.listenable)

  let lightMuted = colorData.colors['LightMuted'].hex; 
  let lightMutedOpposite = LightenDarkenColor(colorData.colors['Vibrant'], 20);


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
    //imgListenable: (colorData.listenable).toString(2),
    //img desc
    imgDesc: colorData.desc,
    //img src
    imgSrc: colorData.src,
    //img listen
    imgListen: colorData.listen,

    /* ~~~~~~~~~~~~~~~~~~~~~
      Side-Navbar Color Data
     ~~~~~~~~~~~~~~~~~~~~~ */
    //'MARTIN BARKER' navbar title text color
    textColor1: lightMutedOpposite, //colorData.colors['DarkMuted'].hex,   
    // navbar active tab text color
    textColor2: colorData.colors['LightVibrant'].hex,
    //navbar hover tab text color
    textColor3: colorData.colors['LightMuted'].hex,
    //navbar text color
    textColor6: colorData.colors['DarkMuted'].hex,

    //'MARTIN BARKER' navbar title background color
    backgroundColor1: lightMuted, //colorData.colors['Vibrant'].hex,
    //navbar tab background color
    backgroundColor2: colorData.colors['LightVibrant'].hex, //linear-gradient(90deg, {{LightVibrant}}, {{Muted}});
    //navbar active tab background color
    backgroundColor3: colorData.colors['DarkMuted'].hex, //linear-gradient(90deg, {{LightVibrant}}, {{LightMuted}})
    //navbar hover tab background color
    backgroundColor4: colorData.colors['Vibrant'].hex,

    /* ~~~~~~~~~~~~~~~~~~~~~
      Page-Content Color Data
     ~~~~~~~~~~~~~~~~~~~~~ */
    //page body background color
    backgroundColor5: colorData.colors['DarkMuted'].hex,
    //page body title background color
    backgroundColor6: colorData.colors['LightVibrant'].hex,

    //page body title text color
    textColor4: colorData.colors['DarkMuted'].hex,
    //page body text color
    textColor5: colorData.colors['LightVibrant'].hex,
    

    //img color display boxes
    Vibrant: colorData.colors['Vibrant'].hex,
    LightVibrant: colorData.colors['LightVibrant'].hex,
    DarkVibrant: colorData.colors['DarkVibrant'].hex,
    Muted: colorData.colors['Muted'].hex,
    LightMuted: colorData.colors['LightMuted'].hex,
    DarkMuted: colorData.colors['DarkMuted'].hex,
    
    
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
      colors[keyName] = {'hex':hexColor, 'rgb':colorValue}
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

/*
   Helper functions
*/

function LightenDarkenColor(col, amt) {
  
  var usePound = false;

  if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
  }

  var num = parseInt(col,16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if  (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if  (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

}

function invertColor(hexTripletColor) {
  var color = hexTripletColor;
  color = color.substring(1);           // remove #
  color = parseInt(color, 16);          // convert to integer
  color = 0xFFFFFF ^ color;             // invert three bytes
  color = color.toString(16);           // convert to hex
  color = ("000000" + color).slice(-6); // pad with leading zeros
  color = "#" + color;                  // prepend #
  return color;
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
      
      'apple1':{
        'src':'http://www.macmothership.com/gallery/gallery3.html',
      },
      
    }

    let imgSrcInfo = {}
    if(imgSources[imgFilename]){
      imgSrcInfo = imgSources[imgFilename]
    }

    resolve(imgSrcInfo)
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
