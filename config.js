var config = {};

config.db = {};
//the URL shortening host - shortened URLs will be this + base58 ID
// i.e.: http://localhost:8080/3Ys
config.webhost = 'https://url-shortener-briceyokoyama.c9users.io/';

//your MongoDB host and database name
config.db.host = 'localhost';
config.db.name = 'url_shortener';

module.exports = config;