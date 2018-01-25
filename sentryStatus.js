//Logic for retreiving the status of Sentrys registered to the Medius
/*-----------------------------------------------------Variables----------------------------------------------------*/
const fs = require('fs');
const request = require('request');
const mediusIP = require('./connection.js');
//getStatusJSON is the body content of the request.post
const getStatusBody = {
"jsonrpc":"2.0",
"method":"Status.GetSentrySystemStatus",
"params":{"outputType":"json","sentryNames":"10.126.2.31, 10.126.2.33, 10.126.2.35, 10.126.2.37, 10.126.2.39"},
"id":5
};
let sentryStats="";
/*----------------------------------------------------Functions-----------------------------------------------------*/
//getStatus function has a future parameter for receiving a preformed body and a parameter for callBack functions
const getStatus = function (/*sentrys,*/){
  //run call to tektronix api and save data to file location
  console.log('\n\nYou are entering Sentry Status Mode...\n');
  console.log('\nStandby for connection to Tektronix API...\n');
  request.post({
    url:     mediusIP,
    headers: {"content-type": "application/json"},
    body:    getStatusBody,
    json: true
  },function(err, response, body){
    if (err) console.log(err)
    else{
      for(i=0;i<body.result.length;i++){
        sentryStats += JSON.stringify(body.result[i], undefined, 2);
      };
      fs.writeFile("./sentryStatusResults/sentryStatus.json", sentryStats, function(err){
        if (err) throw err;
      });
      console.log("\nSentry Status Results have been logged");
    };
  });
};

module.exports = getStatus;
