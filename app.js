require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const indexRouter = require('./routes/index');
const animeRouter = require('./routes/anime');

app.use(express.static(path.join(__dirname, '/public/'))); // loads files in public

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // middleware to access views


app.use('/', indexRouter);
app.use('/anime', animeRouter);

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.listen(PORT, console.log("listening to port " + PORT));
