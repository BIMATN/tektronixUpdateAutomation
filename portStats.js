//Logic for retreiving the status of Sentrys registered to the Medius
/*-----------------------------------------------------Variables----------------------------------------------------*/
const fs = require("fs");
const request = require('request');
const mediusIP = require('./connection.js');
let percentPerSentry = [];
let percentPerModule = [];
let runningTotal = 0;
let licenseModules = 9;//****This will eventually be replaced by a method that recognizes the license totals***
let stats="";
let temp1Bitrate;
let temp2Bitrate;
let result;
let modTotal;
/*----------------------------------------------------Functions----------------------------------------------------------*/
//getPortReport function has a future parameter for receiving a preformed body and a parameter for callBack functions

const getPortReportPromise = function ({sentryData, sentrys}){
  return new Promise ((resolve,reject)=>{
    //run call to tektronix api and save data to file location
    console.log('\nSentry Port Stats Request Running...');
    request.post({
      url:     mediusIP,
      headers: {"content-type": "application/json"},
      body:    sentryData,
      json: true
    },function(err, response, body){
      if (err) {
        console.log(err);
        reject(err);
      }
      else{
        results = body.result;
        for(i=0;i<results.length;i++){
          // console.log(body.result[i]);
          temp1bitrate = parseInt(results[i].intBitrate);
          runningTotal += temp1bitrate;
          stats += (JSON.stringify(body.result[i],undefined,2)+", ");
        };
        fs.writeFile("./portStatsResults/portStats.json", stats, function(err){
          if(err) throw err;
        });
        modTotal = runningTotal / licenseModules; //Determine per module bitrate average
        let x = 0; //Initialize variable value for looping through result array
        let prevXVal = 0; //initialize variable value for subtracting new x value from old x value to get total number of services to be placed in the module
        //Loop through quantity of license modules (9 in our current situation) resulting in an array of values per module that will later be applied to sentry service counts
        for(j=0;j<licenseModules;j++){
          //Perform loop based on being less than the modTotal value
          let z = 0;//initialize z to be 0 for each mod cycle
          while(z<modTotal && x<results.length){
            //Add each service's bitrate until the total is greater than the mod total
            temp2Bitrate = parseInt(results[x].intBitrate);
            z += temp2Bitrate;
            //For each service, increment the value of x by 1 to both move forward in the results array and to represent a service addition to the service count
            x++;
          };
          //push the quotient of the difference of the current x value and previous x value by the total length (representing the percentage of the total) to the percent per sentry array
          percentPerModule.push((x-prevXVal)/results.length);
          prevXVal = x;//setting prevxval to current x value for next cycle
        };
        fs.writeFile("./portStatsResults/percentPerModule.txt", percentPerModule, function(err){
          if(err) throw err;
        });
        let k = 0;
        while(k<percentPerModule.length){
          if(percentPerModule[k+1]){
            percentPerSentry.push(percentPerModule[k]+percentPerModule[k+1]);
            k+=2;
          }
          else{
            percentPerSentry.push(percentPerModule[k]);
            k++;
          };
        };
        fs.writeFile("./portStatsResults/percentPerSentry.txt", percentPerSentry, function(err){
          if(err) throw err;
          console.log("\nPort Stats Data being passed to clear ports function");
          resolve({percentPerSentry, sentrys});
        });
      };
    });
  });
};

/*const getPortReport = function (sentryData, sentrys){
  //run call to tektronix api and save data to file location
  console.log('\n\nSentry Port Stats Request Running...\n');
  request.post({
    url:     mediusIP,
    headers: {"content-type": "application/json"},
    body:    sentryData,
    json: true
  },function(err, response, body){
    if (err) console.log(err)
    else{
      results = body.result;
      for(i=0;i<results.length;i++){
        // console.log(body.result[i]);
        temp1bitrate = parseInt(results[i].intBitrate);
        runningTotal += temp1bitrate;
        stats += (JSON.stringify(body.result[i],undefined,2)+", ");
      };
      fs.writeFile("./portStatsResults/portStats.json", stats, function(err){
        if(err) throw err;
      });
      modTotal = runningTotal / licenseModules; //Determine per module bitrate average
      let x = 0; //Initialize variable value for looping through result array
      let prevXVal = 0; //initialize variable value for subtracting new x value from old x value to get total number of services to be placed in the module
      //Loop through quantity of license modules (9 in our current situation) resulting in an array of values per module that will later be applied to sentry service counts
      for(j=0;j<licenseModules;j++){
        //Perform loop based on being less than the modTotal value
        let z = 0;//initialize z to be 0 for each mod cycle
        while(z<modTotal && x<results.length){
          //Add each service's bitrate until the total is greater than the mod total
          temp2Bitrate = parseInt(results[x].intBitrate);
          z += temp2Bitrate;
          //For each service, increment the value of x by 1 to both move forward in the results array and to represent a service addition to the service count
          x++;
        };
        //push the quotient of the difference of the current x value and previous x value by the total length (representing the percentage of the total) to the percent per sentry array
        percentPerModule.push((x-prevXVal)/results.length);
        prevXVal = x;//setting prevxval to current x value for next cycle
      };
      fs.writeFile("./portStatsResults/percentPerModule.txt", percentPerModule, function(err){
         if(err) throw err;
       });
// This section takes the array of module percentages and converts them to percentage per Sentry, which each Sentry consisting of either 1 or 2 modules
      let k = 0;
      while(k<percentPerModule.length){
        if(percentPerModule[k+1]){
          percentPerSentry.push(percentPerModule[k]+percentPerModule[k+1]);
          k+=2;
        }
        else{
          percentPerSentry.push(percentPerModule[k]);
          k++;
        };
      };
      fs.writeFile("./portStatsResults/percentPerSentry.txt", percentPerSentry, function(err){
         if(err) throw err;
       });
      console.log("\nPort Stats Data being passed to clear ports function\n");
      // sentryConfig(percentPerSentry);
    };
  });
};*/

module.exports = getPortReportPromise;
