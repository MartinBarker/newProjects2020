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
app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    helpers: {
        'compare': function (lvalue, operator, rvalue, options) {

            var operators, result;
            
            if (arguments.length < 3) {
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
            }
            
            if (options === undefined) {
                options = rvalue;
                rvalue = operator;
                operator = "===";
            }
            
            operators = {
                '==': function (l, r) { return l == r; },
                '===': function (l, r) { return l === r; },
                '!=': function (l, r) { return l != r; },
                '!==': function (l, r) { return l !== r; },
                '<': function (l, r) { return l < r; },
                '>': function (l, r) { return l > r; },
                '<=': function (l, r) { return l <= r; },
                '>=': function (l, r) { return l >= r; },
                'typeof': function (l, r) { return typeof l == r; }
            };
            
            if (!operators[operator]) {
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
            }
            
            result = operators[operator](lvalue, rvalue);
            
            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        
        }
        

      }
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