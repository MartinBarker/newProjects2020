//setup express app
const express = require('express');
const app = express();
const port = 3000;

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

//homr page route
app.get('/', (req, res) => {
    //Serves the body of the page ("main.handlebars") to the container ("index.handlebars")
    res.render('main', {layout : 'index'});
});

//render and startup server
app.listen(port, () => console.log(`App listening to port ${port}`));