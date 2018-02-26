/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var logFactory = require('./log-factory');

var dbLogger = logFactory.DBLoggerFactory.getLogger;
var fileLogger = logFactory.FileLoggerFactory.getLogger;
var consoleLogger = logFactory.ConsoleLoggerFactory.getLogger;

var _log = function(tag, msg) {
    dbLogger.log(tag + ' - ' + msg);
    fileLogger.log(tag + ' - ' + msg);
    consoleLogger.log(tag + ' - ' + msg);
};

module.exports.log = function(tag, msg) {
    _log(tag, msg);
}

module.exports.info = function(msg) {
    _log('INFO', msg);
}

module.exports.debug = function(msg) {
    _log('DEBUG', msg);
}

module.exports.error = function(msg) {
    _log('ERROR', msg);
}

module.exports.trace = function(msg) {
    _log('TRACE', msg);
}

module.exports.warn = function(msg) {
    _log('WARN', msg);
}

module.exports.fatal = function(msg) {
    _log('FATAL', msg);
}