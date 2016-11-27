const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
process.env.PWD = process.cwd();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));

app.use(morgan('dev'));
app.use(express.static(process.env.PWD + '/assets'));
app.use(express.static(process.env.PWD + '/dist'));
app.use(express.static(process.env.PWD + '/src'));



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
