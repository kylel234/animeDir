const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const indexRouter = require('./routes/index');
app.use(express.static(path.join(__dirname, '/public/'))); // loads files in public

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // middleware to access views


app.use('/', indexRouter);

app.listen(PORT, console.log("listening to port " + PORT));
