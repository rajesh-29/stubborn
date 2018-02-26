/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var Client = require('node-rest-client').Client;
var client = new Client();
 
module.exports.sendPostReq = function(reqUrl, reqHeaders, reqPayload, handler) {
  var args = {
      data: reqPayload,
      headers: reqHeaders
  };
  client.post(reqUrl, args, function (data, response) {
      handler(data, response);
  });
};

/* ---------------- usage -----------------------
var restClient = require('./.././rest-client');

var handler = function(data, response) {
      if(Buffer.isBuffer(data)) {
        data = data.toString('utf8');
      }
      console.log(data);
}

var _reqUrl = "http://localhost:8080/forward";
var _reqHeaders = { "Content-Type" : "application/json" };
var _reqPayload = { test : "test"};

restClient.sendPostReq(_reqUrl, _reqHeaders, _reqPayload, handler);

*/

/* ---------------- raw http --------------------

var http = require('http');

var options = {
  host: url,
  port: 80,
  path: '/resource?id=foo&bar=baz',
  method: 'POST'
};

http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
}).end();

http.get('http://nodejs.org/dist/index.json', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

*/