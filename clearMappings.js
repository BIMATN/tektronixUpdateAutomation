/*-----------------------------------------------------Variables----------------------------------------------------*/
const request = require('request');
const mediusIP = require('./connection.js');
let inputSettings = []; //Array variable that will contain all the program mapping objects
/*-----------------------------------------------------Functions----------------------------------------------------*/

const clearMappingPromise = function ({percentPerSentry, sentrys}){
  return new Promise ((resolve, reject) => {
    /*-----------------------------------------------------Loops----------------------------------------------------*/
    for(j=0;j<sentrys.length;j++){
      for(i=0;i<250;i++){
        let temp1Obj = {"sentryName":sentrys[j],"portNumber":i,"programNumber":"-1"};
        inputSettings.push(temp1Obj);
      };
      for(i=1000;i<1250;i++){
        let temp2Obj = {"sentryName":sentrys[j],"portNumber":i,"programNumber":"-1"};
        inputSettings.push(temp2Obj);
      };
    };
    const deleteMapping = {
    "jsonrpc":2.0,
    "method":"Program.DeleteProgramMapping",
    "params":{"inputType":"json","inputSettings": inputSettings},
    "id":4
    };
    /*-----------------------------------------------------Post Request----------------------------------------------------*/
     request.post({
           url: mediusIP,
           headers: {"content-type": "application/json"},
           body: deleteMapping,
           json: true
         }, function(err, response, body){
          if (err) {
             console.log("these are program delete errors: "+err);
             reject(err);
           }
           else{
            console.log("\nSentry Mappings Cleared.");
            resolve({percentPerSentry, sentrys});
           }
        });
  })
};

/*const clearMapping = function (percentPerSentry, sentrys){
  //-----------------------------------------------------Loops----------------------------------------------------
  for(j=0;j<sentrys.length;j++){
    for(i=0;i<250;i++){
      let temp1Obj = {"sentryName":sentrys[j],"portNumber":i,"programNumber":"-1"};
      inputSettings.push(temp1Obj);
    };
    for(i=1000;i<1250;i++){
      let temp2Obj = {"sentryName":sentrys[j],"portNumber":i,"programNumber":"-1"};
      inputSettings.push(temp2Obj);
    };
  };
  const deleteMapping = {
  "jsonrpc":2.0,
  "method":"Program.DeleteProgramMapping",
  "params":{"inputType":"json","inputSettings": inputSettings},
  "id":4
  };
  //-----------------------------------------------------Post Request----------------------------------------------------
  request.post({
        url: mediusIP,
        headers: {"content-type": "application/json"},
        body: deleteMapping,
        json: true
      }, function(err, response, body){
        if (err) {
          console.log("these are program delete errors: "+err);
          reject(err);
        }
        else{
          console.log("Connection Success! Sentry Mappings Cleared.\n");
          resolve({percentPerSentry, sentrys});
        }
      });
};*/

module.exports = clearMappingPromise;
