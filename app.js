require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // body parser helps access input elements from server
const methodOverride = require('method-override') // will help app to route to and use the put or delete method 

const indexRouter = require('./routes/index'); // gets route for index
const studioRouter = require('./routes/studios');
const animeRouter = require('./routes/animes');

app.use(express.static(__dirname + '/public')); // loads files in public
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // middleware to access views

app.use(bodyParser.urlencoded({limit: '10mb', extended: false})) 

app.use(methodOverride('_method')) // allows for methods like PUT and DELETE
app.use('/', indexRouter);
app.use('/studios', studioRouter);
app.use('/animes', animeRouter);

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.listen(process.env.PORT || 3000, ()=> {
    console.log("listening to port 3000")
});
