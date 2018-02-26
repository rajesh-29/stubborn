/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var DBLoggerFactory = require('./db-logger.js');
var FileLoggerFactory = require('./file-logger.js');
var ConsoleLoggerFactory = require('./console-logger.js');

module.exports.DBLoggerFactory = DBLoggerFactory;
module.exports.FileLoggerFactory = FileLoggerFactory;
module.exports.ConsoleLoggerFactory = ConsoleLoggerFactory;