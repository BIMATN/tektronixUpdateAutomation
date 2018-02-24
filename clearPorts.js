/*-----------------------------------------------------Variables----------------------------------------------------*/
const request = require('request');
const mediusIP = require('./connection.js');
let inputSettings = []; //Array variable that will contain all the sentry objects
/*----------------------------------------------------Functions-----------------------------------------------------*/

clearPortsPromise = function ({percentPerSentry, sentrys}){
  return new Promise((resolve, reject) => {
    for(j=0;j<sentrys.length;j++){
      let tempObj = {"sentryName":sentrys[j],"inputConnections":["Ethernet 1", "Ethernet 2"]};
      inputSettings.push(tempObj);
    };
    const clearInputBody = {
    "jsonrpc":2.0,
    "method":"Input.ClearMPEGInputByConnection",
    "params":{"inputType":"json","inputSettings":inputSettings},
    "id":3
    }
    request.post({
          url:     mediusIP,
          headers: {"content-type": "application/json"},
          body:    clearInputBody,
          json: true
        }, (err, response, body) => {
          if (err) {
            console.log(err);
            reject(err);
          };
          console.log("\nSentry Input Ports Cleared.");
          resolve({percentPerSentry, sentrys})
        });
  })
};

/*const clearPorts = function (percentPerSentry, sentrys){
  for(j=0;j<sentrys.length;j++){
    let tempObj = {"sentryName":sentrys[j],"inputConnections":["Ethernet 1", "Ethernet 2"]};
    inputSettings.push(tempObj);
  };
  const clearInputBody = {
  "jsonrpc":2.0,
  "method":"Input.ClearMPEGInputByConnection",
  "params":{"inputType":"json","inputSettings":inputSettings},
  "id":3
  }
  request.post({
        url:     mediusIP,
        headers: {"content-type": "application/json"},
        body:    clearInputBody,
        json: true
      }, function(err, response, body){
        if (err) console.log(err);
        //console.log(response);
        console.log("Connection Success! Sentry Input Ports Cleared.\n");
      });
};*/

module.exports = clearPortsPromise;
