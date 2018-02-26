/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var Map = require('./.././map');
var fs = require('fs');

var getMapInstance = function(stubFileName) { 
    // console.log("* Reading map file " + stubFileName);
    var mapInstance = Map.getInstance();
    var data = fs.readFileSync(stubFileName, 'utf8');
    /* works on linux variant
    if(Buffer.isBuffer(data)) {
        data = data.toString('utf8'); 
    }
    var obj = JSON.parse(JSON.stringify(data));
    Object.keys(obj).forEach(function(key) {
            var val = obj[key];
            // console.log(key + "=" + val);
            mapInstance.set(key, val);
    });
    */
    // works on windows
    data = JSON.parse(data);
    Object.keys(data).forEach(function(key) {
        var val = data[key];
        mapInstance.set(key, val);
    });
    return mapInstance;
};

module.exports.getMapInstance = getMapInstance;