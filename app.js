/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var routeManager = require('./routes/route-manager');
var logger = require('./logger');
var map = require('./map');
var mapReader = require('./utils/map-reader.js');
var session = require('express-session');
var sessionOptions = {
  secret: "My$ecret@29",
  resave : true,
  saveUninitialized : false
};

var stubFileName = path.join(__dirname, './config/stub-template.json');
var forwardSettingsFileName = path.join(__dirname, './config/forward-template.json');
console.log(stubFileName);
console.log(forwardSettingsFileName);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	req.stubFileName = stubFileName;
	req.stubMap = mapReader.getMapInstance(stubFileName);
	req.forwardSettingsFileName = forwardSettingsFileName;
	req.forwardMap = mapReader.getMapInstance(forwardSettingsFileName);
	next();
});
app.use('/', routeManager);

var server = http.createServer(app);
server.listen(3000);
logger.info('Server started at port 3000...');

// module.exports = app;