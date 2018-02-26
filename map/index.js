/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var HashMap = require('hashmap');

var SingletonClass = (function () {
    var instance;
    function createInstance() {
        var instance = new HashMap();
        return instance;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

var getSingletonInstance = function() { 
    return SingletonClass.getInstance();
};

var getInstance = function() { 
    var instance = new HashMap();
    return instance;
};

module.exports.getInstance = getInstance;
// module.exports.getSingletonInstance = getSingletonInstance;

/* usage -

var Map = require('./index.js');
var Map = require('./map');
var map = Map.getInstance();

map.set(1, "test 1");
map.set(2, "test 2");
map.set(3, "test 3");
 
map.forEach(function(value, key) {
    console.log(key + " : " + value);
});

 */