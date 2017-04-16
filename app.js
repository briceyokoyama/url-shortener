/*******************************************
 * 
 * THIS CODE IS MODIFIED FROM THIS TUTORIAL FOUND AT: https://coligo.io/create-url-shortener-with-node-express-mongo/
 * ALL CREDIT TO COLIGO
 * 
 * ****************************************/

//require and instantiate express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var config = require('./config');
//base58 for encoding and decoding functions
var base58 = require('./base58.js');
//path module to correctly concatenate pahts
var path = require('path');
//grab the url model
var Url = require('./models/url');

var validUrl = require('valid-url');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(express.static(path.join(__dirname, 'public')));
//handles JSON bodies
app.use(bodyParser.json());
//handles URL encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/api/*', function(req, res){
  console.log(req.params[0]);

  if(validUrl.isWebUri(req.params[0]) !== undefined){
    var longUrl = req.params[0];

      
  var shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);

      // the document exists, so we return it without creating a new entry
      res.send({
        'longUrl': longUrl,
        'shortUrl': shortUrl});
    } else {
      // since it doesn't exist, let's go ahead and create it:
      var newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        shortUrl = config.webhost + base58.encode(newUrl._id);

        console.log("sending new");
        res.send({
          'longUrl': longUrl,
          'shortUrl': shortUrl});
      });
    }

  });

  } else {
    res.send({error: "Please enter a valid URL"});
  }
});

app.get('/:encoded_id', function(req, res){

  var base58Id = req.params.encoded_id;

  var id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      res.redirect(doc.long_url);
    } else {
      res.redirect(config.webhost);
    }
  });

});

var server = app.listen(8080);