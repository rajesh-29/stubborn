/*
 * Project - stubborn
 * Author - Rajesh Borade
 * Description - It is a node server which returns stub response for given URL.
 * For other URLs, requests are forwarded to actual server configured in the forwarding settings.
 */

var express = require('express');
var router = express.Router();
var logger = require('./.././logger');
var restClient = require('./.././rest-client');
var fs = require('fs');
var ip = require("ip");
var serverDetails = "http://" + ip.address() + ":3000";
var messageQueue = require('./.././utils/message-queue.js');
var logQueue = messageQueue.getSingletonInstance();
var enableQueue = false;

router.get('/stubborn', function(req, res, next) {
  logger.debug('*** GET - home ');
  res.header('Access-Control-Allow-Origin', "*");
  res.render("index",{serverDetails : serverDetails, enableQueue : enableQueue});
});

router.get('/status', function(req, res, next) {
  logger.debug('*** GET - status ');
  var _resBody = { status : 'RUNNING' };
  res.header('Access-Control-Allow-Origin', "*");
  res.status(200).send(_resBody);
	res.end();
});

router.get('/forwardSettings', function(req, res, next) {
  logger.debug('*** GET - forwardSettings ');
  fs.readFile(req.forwardSettingsFileName, 'utf8', function (err,data) {
    if (err) {
      var _resBody = { status : 'ERROR' };
      res.header('Access-Control-Allow-Origin', "*");
      res.status(500).send(_resBody);
    }
    else {
      var _resBody = data;
      res.header('Access-Control-Allow-Origin', "*");
      res.status(200).send(_resBody);
    }
  });
});

router.get('/stub', function(req, res, next) {
  logger.debug('*** GET - stub ');
  fs.readFile(req.stubFileName, 'utf8', function (err,data) {
    if (err) {
      var _resBody = { status : 'ERROR' };
      res.header('Access-Control-Allow-Origin', "*");
      res.status(500).send(_resBody);
    }
    else {
      var _resBody = data;
      res.header('Access-Control-Allow-Origin', "*");
      res.status(200).send(_resBody);
    }
  });
});

router.get('/serverActivity', function(req, res, next) {
  // logger.trace('*** GET - serverActivity ');
  enableQueue = true;
  if (logQueue.size() > 0) {
    var _resBody = logQueue.deq();
    res.header('Access-Control-Allow-Origin', "*");
    res.status(200).send(_resBody);
  }
  else {
    var _resBody = { STATUS : 'EMPTY' };
    res.header('Access-Control-Allow-Origin', "*");
    res.status(200).send(_resBody);
  }
  // logger.trace('Message queue count = ' + logQueue.size());
});

router.get('/resetQueue', function(req, res, next) {
  // logger.trace('*** GET - resetQueue ');
  enableQueue = false;
  while (logQueue.size() > 0) {
    var _resBody = logQueue.deq();    
  }
  var _resBody = { STATUS : 'SUCCESS' };
  res.header('Access-Control-Allow-Origin', "*");
  res.status(200).send(_resBody);
  // logger.trace('Message queue count = ' + logQueue.size());
});

router.put('/saveForwardSettings', function(req, res, next) {
  logger.debug('*** PUT saveForwardSettings ');
  var _payload = JSON.stringify(req.body);
  logger.debug('Saving to file ' + req.forwardSettingsFileName);
  logger.debug(_payload);
  fs.writeFileSync(req.forwardSettingsFileName, _payload);
  res.header('Access-Control-Allow-Origin', "*");
  res.status(200).end();
  /* async file write
  fs.writeFile(req.forwardSettingsFileName, _payload, function(err) {
    if (err) {
      var _resBody = { status : 'ERROR' };
      res.status(500).send(_resBody);
    }
    else {
      var _resBody = { status : 'SUCCESS' };
      res.status(200).send(_resBody);
    }
  });
  */
});

router.put('/saveStub', function(req, res, next) {
  logger.debug('*** PUT saveStub ');
  var _payload = JSON.stringify(req.body);
  logger.debug('Saving to file ' + req.stubFileName);
  logger.debug(_payload);
  fs.writeFileSync(req.stubFileName, _payload);
  res.header('Access-Control-Allow-Origin', "*");
  res.status(200).end();
  /* async file write
  fs.writeFile(req.stubFileName, _payload, function(err) {
    if (err) {
      var _resBody = { status : 'ERROR' };
      res.status(500).send(_resBody);
    }
    else {
      var _resBody = { status : 'SUCCESS' };
      res.status(200).send(_resBody);
    }
  });
  */ 
});


/* Handler for all the post requests */
router.post('/*', function(req, res, next) {
  
  var absoluteRequestPath = req.originalUrl;
  var dateObj = new Date();
  var timestamp = dateObj.getFullYear() + "-" + dateObj.getMonth() + "-" + dateObj.getDate() +
    " " + dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds() + ":" + dateObj.getMilliseconds();
  var fullRequestUrl = req.protocol + '://' + req.get('host') + absoluteRequestPath;
  var _stubMap = req.stubMap;
  var _forwardMap = req.forwardMap;
  req.headers['Content-Type'] = 'application/json';
  logger.info("*** POST REQUEST_URL " + fullRequestUrl);
  logger.info("*** POST REQUEST_HEADERS " + JSON.stringify(req.headers));
  logger.info("*** POST REQUEST_BODY " + JSON.stringify(req.body));

  var logMessage = {URL : fullRequestUrl, TIMESTAMP : timestamp, HEADERS : req.headers, BODY : req.body};
  var _parsedReq = JSON.parse(JSON.stringify(req.body));
  
  var keySpecificStub; 
  if(_parsedReq.Request) {
    // logger.trace("* req.Request = " + JSON.stringify(_parsedReq.Request));
    if(_parsedReq.Request.MDN) {
      // logger.trace("* MDN = " + _parsedReq.Request.MDN);
      if(_stubMap.has(absoluteRequestPath + "#" + _parsedReq.Request.MDN)) {
        keySpecificStub = _stubMap.get(absoluteRequestPath + "#" + _parsedReq.Request.MDN);
      }  
    }
  }
  var envSpecificStub; 
  if(_parsedReq) {
    // logger.trace("* _parsedReq = " + JSON.stringify(_parsedReq));
    if(_parsedReq.ClientCode) {
      // logger.trace("* ClientCode = " + _parsedReq.ClientCode);
      if(_stubMap.has(absoluteRequestPath + "#" + _parsedReq.ClientCode)) {
        envSpecificStub = _stubMap.get(absoluteRequestPath + "#" + _parsedReq.ClientCode);
      }  
    }
  }

  if(keySpecificStub) {
    logger.trace("The MDN specific stub exists");
    // logger.trace("" + JSON.stringify(keySpecificStub));
    res.header('Access-Control-Allow-Origin', "*");
    res.send(JSON.stringify(keySpecificStub));
    logMessage['RESPONSE_STUB'] = keySpecificStub;
	if(enableQueue) {
		logQueue.enq(logMessage);
		logger.trace('Message queue count = ' + logQueue.size());
	}
  }
  else if(envSpecificStub) {
    logger.trace("The Client specific stub exists");
    // logger.trace("" + JSON.stringify(envSpecificStub));
    res.header('Access-Control-Allow-Origin', "*");
    res.send(JSON.stringify(envSpecificStub));
    logMessage['RESPONSE_STUB'] = envSpecificStub;
	if(enableQueue) {
		logQueue.enq(logMessage);
		logger.trace('Message queue count = ' + logQueue.size());
	}
  }
  else if(_stubMap.has(absoluteRequestPath)) {
    logger.trace('Returning STUB response');
    var _resBody = _stubMap.get(absoluteRequestPath);
    // var _resBody = { status : 'STUB' };
    res.header('Access-Control-Allow-Origin', "*");
    res.send(JSON.stringify(_resBody));
    logMessage['RESPONSE_STUB'] = _resBody;
	if(enableQueue) {
		logQueue.enq(logMessage);
		logger.trace('Message queue count = ' + logQueue.size());
	}
  }
  else if(_forwardMap.has(absoluteRequestPath)) {
    var _forwardHost = _forwardMap.get(absoluteRequestPath);
    var _handler = function(data, response) {
        if(Buffer.isBuffer(data)) {
          data = data.toString('utf8');
        }
        // console.log(data);
        // var _resBody = { status : 'FORWARD' };
        res.header('Access-Control-Allow-Origin', "*");
        res.send(data);
        logMessage['RESPONSE_ACTUAL'] = data;
		if(enableQueue) {
			logQueue.enq(logMessage);
			logger.trace('Message queue count = ' + logQueue.size());
		}
    }
    var _reqUrl = _forwardHost + absoluteRequestPath;
    // var _reqHeaders = { "Content-Type" : "application/json" };
    var _reqHeaders = req.headers;
    var _reqPayload = req.body;
    logger.trace('Forwarding request to actual server ');
    logger.trace('_reqUrl ' + _reqUrl);
    logger.trace('_reqHeaders ' + JSON.stringify(_reqHeaders));
    logger.trace('_reqPayload ' + JSON.stringify(_reqPayload));
    restClient.sendPostReq(_reqUrl, _reqHeaders, _reqPayload, _handler);
  }
  else {
    logger.error('Error occured');
    var _resBody = { status : 'ERROR' };
    res.header('Access-Control-Allow-Origin', "*");
    res.status(404).send(JSON.stringify(_resBody));
    logMessage['RESPONSE_ERROR'] = _resBody;
	if(enableQueue) {
		logQueue.enq(logMessage);
		logger.trace('Message queue count = ' + logQueue.size());
	}
  }
});

module.exports = router;