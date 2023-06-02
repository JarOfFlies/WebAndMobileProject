const EXPRESS = require("express");
const PATH = require("path");
const CHALK = require("chalk");
const DEBUG = require("debug") ("app");
const MORGAN = require("morgan");
const DATABASE = require('./src/Bases/dbBase');
const SEARCHROUTER = require("./src/Router/searchRouter");

const APP = EXPRESS();
const PORT = process.env.PORT || 3000;

APP.use(MORGAN("tiny"));

DATABASE.dbConnect();

APP.set('views', './src/views');

APP.use(EXPRESS.static(PATH.join(__dirname,  '/public')));
APP.use("/css", EXPRESS.static(PATH.join(__dirname, '/node_modules/bootstrap/dist/css')));
APP.use("/js", EXPRESS.static(PATH.join(__dirname, '/node_modules/bootstrap/dist/js')));
APP.use("/js", EXPRESS.static(PATH.join(__dirname, '/node_modules/jquery/dist')));
APP.set('view engine', 'ejs');

APP.get('/', function(req, res){
    res.render('index',
        {
            title: 'Card Search Engine'
        }
    );
});

APP.use('/search', SEARCHROUTER);

APP.listen(PORT, function(){
    DEBUG(`Listening on port ${CHALK.green(PORT)}`);
});