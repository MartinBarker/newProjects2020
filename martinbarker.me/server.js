//setup express app
const express = require('express');
const app = express();
const port = 3000;
var path = require('path')

var cors = require('cors')
app.use(cors())
var fmpeg = require('fluent-ffmpeg')
var host = '0.0.0.0';

//set cors for all routes 
/*
app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
*/

//ffmpeg route
app.get('/', (req, res) => {
    res.contentType('audio/mp3');
    res.attachment('myfile.mp3');
    var pathToAudio = 'https://dl.dropbox.com/s/pc7qp4wrf46t9op/test-clip.webm?dl=0';
    ffmpeg(pathToAudio).toFormat('mp3')
        .on('end', function(err) {
            console.log('done!')
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        .pipe(res, {end: true})
});

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
}));

//Tells app to use '/public' folder for static files
app.use(express.static('public'))
//var path = require('path')
//app.use(express.static(path.join(__dirname, '/static/')));

//connect all routes
const routes = require('./routes');
app.use('/', routes);

//use this folder for static files
app.use('/static/', express.static(__dirname + '/static/'));

//render and startup server
app.listen(port, () => console.log(`App listening to port ${port}`));