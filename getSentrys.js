//Logic for retrieving Sentrys Registered to Medius
/*-----------------------------------------------------Variables----------------------------------------------------*/
const fs = require('fs');
const request = require('request');
const mediusIP = require('./connection.js');
const postBody = {
  "jsonrpc":2.0,
  "method":"Report.GetRegisteredSentrys",
  "params":{"outputType":"json"},
  "id":1
};
let sentryData = {};
let sentrys = [];
/*----------------------------------------------------Functions-----------------------------------------------------*/
const getSentrysPromise = new Promise((resolve,reject)=>{
  console.log('\nRetreiving Registered Sentrys...');
  request.post({
    url:     mediusIP,
    headers: {"content-type": "application/json"},
    body:    postBody,
    json: true
  },(err, response, body) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        //Loop through body.result
        for(i=0;i<body.result.length;i++){
          // console.log(body.result[i]);
          sentrys.push(body.result[i].ip_addr);
        };
        // object below with sentry IPs retreieved above will be passed to the sentry Status function in the cli.js file
        fs.writeFile("./getSentrysResults/sentrys.txt", sentrys, function(err){
          if(err) throw err;
        });
        sentryData = {
        "jsonrpc":2.0,
        "method":"Report.GetPortStatus",
        "params":{"outputType":"json","activeOnly":true,"sentryNames":sentrys.toString()},
        "id":2
        };
        console.log("\nPassing Registered Sentrys to Port Stats function");
        resolve({sentryData, sentrys});
      };
    });
})

/*const getSentrys = () => {
  console.log('\n\nYou are entering Channel Launch Mode...\n');
  console.log('\nRetreiving Registered Sentrys...\n');
  request.post({
    url:     mediusIP,
    headers: {"content-type": "application/json"},
    body:    postBody,
    json: true
  },(err, response, body) => {
      if (err) console.log(err)
      else{
        //Loop through body.result
        for(i=0;i<body.result.length;i++){
          // console.log(body.result[i]);
          sentrys.push(body.result[i].ip_addr);
        };
        // object below with sentry IPs retreieved above will be passed to the sentry Status function in the cli.js file
        fs.writeFile("./getSentrysResults/sentrys.txt", sentrys, function(err){
          if(err) throw err;
        });
        sentryData = {
        "jsonrpc":2.0,
        "method":"Report.GetPortStatus",
        "params":{"outputType":"json","activeOnly":true,"sentryNames":sentrys.toString()},
        "id":2
        };
        console.log("\nPassing Sentry data to Port Stats function");
      };
    });
};*/

module.exports = getSentrysPromise;
