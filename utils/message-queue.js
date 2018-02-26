/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var Queue = require('queuejs'); 

var SingletonClass = (function () {
    var instance;
    return {
        getInstance: function () {
            if (!instance) {
                instance = new Queue();
            }
            return instance;
        }
    };
})();

var q = (function () {
    return {
        size: function () {
            return SingletonClass.getInstance().size();
        },
        deq: function () {
            return SingletonClass.getInstance().deq();
        },
        enq: function (element) {
            // deep copy into queue
            SingletonClass.getInstance().enq(JSON.stringify(element));
        }
    };
})();

module.exports.getSingletonInstance = function() {
    return q;
};

/* usage

var messageQueue = require('./message-queue.js');
var q = messageQueue.getSingletonInstance();
console.log(q);
q.enq("m1");
q.enq("m2");
console.log(q.size());
console.log(q.deq());
console.log(q.size());

*/