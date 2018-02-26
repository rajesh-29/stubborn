/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var log = function(msg) {
    // console.log('FileLogger - ' + msg);
};

var getLogger = {log : log};

module.exports.getLogger = getLogger;