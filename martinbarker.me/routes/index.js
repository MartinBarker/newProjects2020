const express = require('express');
const app = express();
var router = express.Router();
//nodejs virbant color picker extension
var Vibrant = require('node-vibrant')
const Post = require('../database/models/Post.js');

//view single blog post
app.get('/posts/:id', async (req, res) => {
  //get mainTemplate data
  let mainTemplateData = await getMainTemplateData(req.params.id)
  let colorData = await getColorData()
  const post = await Post.findById(req.params.id)

  let displayPosts = mainTemplateData.postsDisplay;

  console.log('xx active id = ', post._id, ', displayPosts = ', displayPosts)
  //set activeTab == 'true'

  res.render('post', {
      layout: 'mainTemplate', 
      posts: post,
      pageTitle:'x',
      blog:'active',
      //icon:'z',
      blog:'active',
      pageBodyNavTitle: 'blog post title',
      pageBodyNaavGithub: 'x',
      //mainTemplateData
      posts:displayPosts,
      /*----------
        image and image-modal
        ----------*/
      //img path
      imgPath: '/'+mainTemplateData.imgPath, //'/static/assets/aesthetic-images/R-6588332-1422623362-7390.jpeg.jpg',
      //img desc
      imgDesc: mainTemplateData.desc,
      //img src
      imgSrc: mainTemplateData.src,
      //img listen
      imgListen: mainTemplateData.listen,
        /*----------
      'Martin Barker' Navbar Header colors
      ----------*/
      textColor1: mainTemplateData.colorData.textColor1, //
      backgroundColor1: mainTemplateData.colorData.backgroundColor1, //

      /*----------
        sidebar un-active tab colors
        ----------*/ 
      textColor6: mainTemplateData.colorData.textColor6, //getReadableTextColor(colorData.colors['LightVibrant'].rgb), //sidebar tab option text color
      backgroundColor2: mainTemplateData.colorData.backgroundColor2, //colorData.colors['LightVibrant'].hex,  //sidebar background color
      
      /*----------
        sidebar active tab colors
        ----------*/ 
      textColor2: mainTemplateData.colorData.textColor2, //getReadableTextColor(colorData.colors['LightMuted'].rgb), //active tab text color
      backgroundColor3: mainTemplateData.colorData.backgroundColor3, //colorData.colors['LightMuted'].hex,

      /*----------
        sidebar lower background
        ----------*/
        textColor7: mainTemplateData.colorData.textColor7, //getReadableTextColor(colorData.colors['DarkVibrant'].rgb),
        backgroundColor7: mainTemplateData.colorData.backgroundColor7, //colorData.colors['DarkVibrant'].hex,  

      /*----------
        sidebar hover tab colors
        ----------*/ 
      textColor3: mainTemplateData.colorData.textColor3, //getReadableTextColor(colorData.colors['Vibrant'].rgb), //navbar hover tab text color
      backgroundColor4: mainTemplateData.colorData.backgroundColor4, //colorData.colors['Vibrant'].hex,
      
      /*----------
        body header title colors
        ----------*/
      textColor4: mainTemplateData.colorData.textColor4, //getReadableTextColor(colorData.colors['Muted'].rgb),
      backgroundColor6: mainTemplateData.colorData.backgroundColor6, //colorData.colors['Muted'].hex,

      /*----------
        body colors
        ----------*/
      textColor5: mainTemplateData.colorData.textColor5, //getReadableTextColor(colorData.colors['LightMuted'].rgb),
      backgroundColor5: mainTemplateData.colorData.backgroundColor5, //colorData.colors['LightMuted'].hex,

      //img color display boxes
      Vibrant: mainTemplateData.colorData.Vibrant, //colorData.colors['Vibrant'].hex,
      LightVibrant: mainTemplateData.colorData.LightVibrant, //colorData.colors['LightVibrant'].hex,
      DarkVibrant: mainTemplateData.colorData.DarkVibrant, //colorData.colors['DarkVibrant'].hex,
      Muted: mainTemplateData.colorData.Muted, //colorData.colors['Muted'].hex,
      LightMuted: mainTemplateData.colorData.LightMuted, //colorData.colors['LightMuted'].hex,
      DarkMuted: mainTemplateData.colorData.DarkMuted, //colorData.colors['DarkMuted'].hex,
      
  })
});

//home route
app.get('/', async function (req, res) {
  //get color data based on a random image from /static/assets/aesthetic-images
  let colorData = await getColorData()
  //get display title for each blog post
  let postsDisplay = await getPostsDisplay()

  res.render('about', {
    //template layout to use
    layout: 'mainTemplate', 
    //page title of tab
    pageTitle: 'martinbarker.me',
    //page tab icon
    icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png',
    //set active current tab
    about: 'active',
    //body content title 
    pageBodyNavTitle: 'martinbarker.me',
    //body content github link
    pageBodyNavGithub: 'temp',
    //blog posts
    posts: postsDisplay,//[{title:'a'}, {title:'b'}],

    /*----------
      image and image-modal
      ----------*/
    //img path
    imgPath: colorData.imgPath,
    //img desc
    imgDesc: colorData.desc,
    //img src
    imgSrc: colorData.src,
    //img listen
    imgListen: colorData.listen,

    /*----------
      'Martin Barker' Navbar Header colors
      ----------*/
    textColor1: getReadableTextColor(colorData.colors['DarkMuted'].rgb), //background color
    backgroundColor1: colorData.colors['DarkMuted'].hex,   //text color

    /*----------
      sidebar un-active tab colors
      ----------*/ 
    textColor6: getReadableTextColor(colorData.colors['LightVibrant'].rgb), //sidebar tab option text color
    backgroundColor2: colorData.colors['LightVibrant'].hex,  //sidebar background color
    
    /*----------
      sidebar active tab colors
      ----------*/ 
    textColor2: getReadableTextColor(colorData.colors['LightMuted'].rgb), //active tab text color
    backgroundColor3: colorData.colors['LightMuted'].hex,

    /*----------
      sidebar lower background
      ----------*/
      textColor7: getReadableTextColor(colorData.colors['DarkVibrant'].rgb),
      backgroundColor7: colorData.colors['DarkVibrant'].hex,  

    /*----------
      sidebar hover tab colors
      ----------*/ 
    textColor3: getReadableTextColor(colorData.colors['Vibrant'].rgb), //navbar hover tab text color
    backgroundColor4: colorData.colors['Vibrant'].hex,
    
    /*----------
      body header title colors
      ----------*/
    textColor4: getReadableTextColor(colorData.colors['Muted'].rgb),
    backgroundColor6: colorData.colors['Muted'].hex,

    /*----------
      body colors
      ----------*/
    textColor5: getReadableTextColor(colorData.colors['LightMuted'].rgb),
    backgroundColor5: colorData.colors['LightMuted'].hex,

    //img color display boxes
    Vibrant: colorData.colors['Vibrant'].hex,
    LightVibrant: colorData.colors['LightVibrant'].hex,
    DarkVibrant: colorData.colors['DarkVibrant'].hex,
    Muted: colorData.colors['Muted'].hex,
    LightMuted: colorData.colors['LightMuted'].hex,
    DarkMuted: colorData.colors['DarkMuted'].hex,
  });
})

async function getMainTemplateData(activeTabId){
  return new Promise(async function (resolve, reject) {
    //get color data based on a random image from /static/assets/aesthetic-images
    let colorData = await getColorData()
    //get display title for each blog post
    let postsDisplay = await getPostsDisplay(colorData.colors['LightMuted'].hex, activeTabId, getReadableTextColor(colorData.colors['LightMuted'].rgb))

    let mainTemplateData = {
      colorDataRaw:colorData,
      colorData:{
        textColor1: getReadableTextColor(colorData.colors['DarkMuted'].rgb), 
        backgroundColor1: colorData.colors['DarkMuted'].hex,   
        textColor2: getReadableTextColor(colorData.colors['LightMuted'].rgb), //active tab text color
        backgroundColor3: colorData.colors['LightMuted'].hex,
        textColor7: getReadableTextColor(colorData.colors['DarkVibrant'].rgb),
        backgroundColor7:  colorData.colors['DarkVibrant'].hex,
        textColor3: getReadableTextColor(colorData.colors['Vibrant'].rgb), //navbar hover tab text color
        backgroundColor4: colorData.colors['Vibrant'].hex, 
        textColor4: getReadableTextColor(colorData.colors['Muted'].rgb),
        backgroundColor6: colorData.colors['Muted'].hex,
        textColor5: getReadableTextColor(colorData.colors['LightMuted'].rgb),
        backgroundColor5: colorData.colors['LightMuted'].hex,
        Vibrant: colorData.colors['Vibrant'].hex,
        LightVibrant: colorData.colors['LightVibrant'].hex,
        DarkVibrant: colorData.colors['DarkVibrant'].hex,
        Muted: colorData.colors['Muted'].hex,
        LightMuted: colorData.colors['LightMuted'].hex,
        DarkMuted: colorData.colors['DarkMuted'].hex,
      }, 
      imgPath:colorData.imgPath,
      imgDesc:colorData.desc,
      imgSrc:colorData.src,
      imgListen:colorData.listen,
      
      postsDisplay:postsDisplay
    }
    resolve(mainTemplateData)
  })
}

async function getPostsDisplay(activeTabColorHex, activeTabId, activeTabTextColor){
  return new Promise(async function (resolve, reject) {
    const posts = await Post.find({})
    let postsDisplay = []
    for(var i = 0; i < posts.length; i++){
      let tempObj = null;
      if(activeTabId == posts[i]._id){
        tempObj = {title:posts[i].title, id:posts[i]._id, activeTabTextColor:activeTabTextColor, activeTabColor:activeTabColorHex, activeTab:'true'}
      }else{
        tempObj = {title:posts[i].title, id:posts[i]._id}
      }
      postsDisplay.push(tempObj)
    }
    resolve(postsDisplay)
  })
}

//tagger route
app.get('/tagger', async function (req, res) {
  //get color data based on a random image from /static/assets/aesthetic-images
  let colorData = await getColorData()
  console.log('/tagger imgListenable = ', colorData.listenable)

  let navbarHeaderColorObj = colorData.colors['LightMuted']
  let navbarHeaderBackground = navbarHeaderColorObj.hex; 
  let navbarHeaderText = getReadableTextColor(navbarHeaderColorObj.rgb)

  res.render('tagger', {
    //template layout to use
    layout: 'mainTemplate', 
    //page title of tab
    pageTitle: 'tagger.site',
    //page tab icon
    icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png',
    //expand projects tab
    projects: 'active',
    //set active current tab
    tagger: 'active',
    //body content title 
    pageBodyNavTitle: 'tagger.site',
    //body content github link
    pageBodyNavGithub: 'temp',
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

    /*----------
      'Martin Barker' Navbar Header colors
      ----------*/
    textColor1: getReadableTextColor(colorData.colors['DarkMuted'].rgb), //background color
    backgroundColor1: colorData.colors['DarkMuted'].hex,   //text color

    /*----------
      sidebar un-active tab colors
      ----------*/ 
    textColor6: getReadableTextColor(colorData.colors['LightVibrant'].rgb), //sidebar tab option text color
    backgroundColor2: colorData.colors['LightVibrant'].hex,  //sidebar background color
    
    /*----------
      sidebar active tab colors
      ----------*/ 
    textColor2: getReadableTextColor(colorData.colors['LightMuted'].rgb), //active tab text color
    backgroundColor3: colorData.colors['LightMuted'].hex,

    /*----------
      sidebar lower background
      ----------*/
      textColor7: getReadableTextColor(colorData.colors['DarkVibrant'].rgb),
      backgroundColor7: colorData.colors['DarkVibrant'].hex,  

    /*----------
      sidebar hover tab colors
      ----------*/ 
    textColor3: getReadableTextColor(colorData.colors['Vibrant'].rgb), //navbar hover tab text color
    backgroundColor4: colorData.colors['Vibrant'].hex,
    
    /*----------
      body header title colors
      ----------*/
    textColor4: getReadableTextColor(colorData.colors['Muted'].rgb),
    backgroundColor6: colorData.colors['Muted'].hex,

    /*----------
      body colors
      ----------*/
    textColor5: getReadableTextColor(colorData.colors['LightMuted'].rgb),
    backgroundColor5: colorData.colors['LightMuted'].hex,
    

    /* ~~~~~~~~~~~~~~~~~~~~~
      Side-Navbar Color Data
     ~~~~~~~~~~~~~~~~~~~~~ */
    //'MARTIN BARKER' navbar title text color
    //textColor1: navbarHeaderText, //colorData.colors['DarkMuted'].hex,   
    
    //textColor2: colorData.colors['DarkVibrant'].hex, // navbar active tab text color
    
    //textColor3: colorData.colors['LightMuted'].hex, //navbar hover tab text color
    //navbar text color
    //textColor6: colorData.colors['DarkMuted'].hex,

    //'MARTIN BARKER' navbar title background color
    //backgroundColor1: navbarHeaderBackground, //colorData.colors['Vibrant'].hex,
    //navbar tab background color
    //backgroundColor2: colorData.colors['LightVibrant'].hex, //linear-gradient(90deg, {{LightVibrant}}, {{Muted}});
    //navbar active tab background color
    //backgroundColor3: colorData.colors['DarkMuted'].hex, //linear-gradient(90deg, {{LightVibrant}}, {{LightMuted}})
    //navbar hover tab background color
    //backgroundColor4: colorData.colors['LightVibrant'].hex,

    /* ~~~~~~~~~~~~~~~~~~~~~
      Page-Content Color Data
     ~~~~~~~~~~~~~~~~~~~~~ */
    //page body background color
    
    //page body title background color
    

    //page body title text color
    
    //page body text color
    
    

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
  let colorData = await getColorData()
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



//api route to return pageColors
app.post('/getColors', async function (req, res) {
  //let filepath = req.body.filepath
  console.log("/getColors")
  let colorData = await getColorData()
  res.send(colorData)
});

//return pageColors
async function getColorData() {
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

function getReadableTextColor(inputRGBcolor){
  if(((inputRGBcolor[0])*0.299 + (inputRGBcolor[1])*0.587 + (inputRGBcolor[2])*0.114) > 186){
    return("#000000")  
  }else{
    return("#ffffff")
  }
}

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

