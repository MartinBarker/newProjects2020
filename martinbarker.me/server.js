//setup express app
const express = require('express');
const app = express();
var router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//port and hosting info
const port = 3000;

//set cors for all routes
app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    helpers: {
        'ifEquals': function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        'ifActiveId': function (arg1, arg2, options) {
            console.log('ifActiveId: options=',options)
            //return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
            return true;
        }
    },
}));

//Tells app to use '/public' folder for static files
app.use(express.static('public'))

/*
console.log('begin mongodb connection')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUserPassword@cluster0.qotrh.gcp.mongodb.net/node-blog?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
console.log('client created')
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
console.log('after client connect code')

mongoose.connect('mongodb://localhost:27017/node-blog', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

//store post

app.post('/posts/store', (req, res) => {
    Post.create(req.body, (error, post) => {
        res.redirect('/tagger')
    })
});

//retrieve posts
const Post = require('./database/models/Post');
app.get('/posts', async (req, res) => {
    const posts = await Post.find({})
    console.log('/posts posts = ', posts)
    res.render('post', {
        layout: 'mainTemplate', 
        posts: posts,
    })
});
*/
//connect all routes
const routes = require('./routes');
app.use('/', routes);

//use this folder for static files
app.use('/static/', express.static(__dirname + '/static/'));

//render and startup server
app.listen(port, () => console.log(`App listening to port ${port}`));