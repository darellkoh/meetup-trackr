const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));

app.use(morgan('dev'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/src'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
  console.log('Express server listening on port ' + PORT);
});

// Home Page
app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
});

// Error handling
app.use(function(err, req, res, next){
  console.log(err.stack);
  res.sendStatus((err.status) || 500);
});

module.exports = app;
