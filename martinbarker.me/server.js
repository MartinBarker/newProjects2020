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

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://dbUser:dbUserPassword@cluster0.qotrh.gcp.mongodb.net/node-blog?retryWrites=true&w=majority";

// Connect to the db
MongoClient.connect(url, (err, client) => {
    if(!err){
        console.log("We are connected");
        // Client returned
        var db = client.db('node-blog');
        var collection = db.collection("posts");

        //find single post 
        /*
        collection.findOne({}, function(err, result) {
            if(err){
                console.log('collection find err = ', err)
            }else{
                console.log('result = ', result);
            }    
          });
          */

        //find all posts
        var cursor = db.collection('posts').find();
        // Execute the each command, triggers for each document
        cursor.each(function(err, item) {
            // If the item is null then the cursor is exhausted/empty and closed
            if(item == null) {
                return;
            }
            // otherwise, do something with the item
            console.log('item = ', item)
        });

    }else{
        console.log("not connected, err = ", err);
    }

});

/*
MongoClient.connect(url, function(err, db) {
  if(!err) {
    console.log("We are connected");
    const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    const collection = client.db("node-blog").collection("posts");
    console.log('collection =', collection); 
  }else{
      console.log('err = ', err)
  }
});

client.connect(err => {
    if(!err){
        console.log("We are connected");  
    }else{
        console.log('err = ', err)
    }
    var cursor = client.collection('posts').find();
    console.log('cursor =', cursor); 
});

const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

var cursor = client.db.collection('posts').find();

// Execute the each command, triggers for each document
cursor.each(function(err, item) {
    // If the item is null then the cursor is exhausted/empty and closed
    if(item == null) {
        db.close(); // you may not want to close the DB if you have more code....
        return;
    }
    // otherwise, do something with the item
});

  client.connect(err => {
    const collection = client.db("node-blog").collection("posts");
    collection.findOne({title: 'blogPost1'}, function(err, document) {
    console.log('document =', document); //title:blogPost1"
    });
    
    //const post = collection.findById('5f4c1b0274e9b50f5e2b32c7')
  
    // perform actions on the collection object
    client.close();
  });

client.connect(err => {
  const collection = client.db("node-blog").collection("posts");
  console.log('collection = ', collection)
  
  //const post = collection.findById('5f4c1b0274e9b50f5e2b32c7')

  // perform actions on the collection object
  client.close();
});
*/

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