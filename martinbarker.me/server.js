//setup express app
const express = require('express');
const app = express();
var router = express.Router();

//port and hosting info
const port = 3000;
var host = '0.0.0.0';

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    helpers: {
        'ifEquals': function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
            //return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
        

    },
    
}));

//Tells app to use '/public' folder for static files
app.use(express.static('public'))

//connect all routes
const routes = require('./routes');
app.use('/', routes);

//use this folder for static files
app.use('/static/', express.static(__dirname + '/static/'));

//render and startup server
app.listen(port, () => console.log(`App listening to port ${port}`));