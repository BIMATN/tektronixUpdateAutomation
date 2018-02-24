//Logic for performing Sentry Input Configuration
/*-----------------------------------------------------Variables----------------------------------------------------*/
const fs = require('fs');
const request = require('request');
const xlsxj = require('xlsx-to-json');
const mediusIP = require('./connection.js');
let services2Add={"inputType":"json"};//Creating the object that is the value of the params key that is passed to the Medius
let programMappings={"inputType":"json"};//Creating the object that is the value of the params key that is passed to the Medius
let inputSettings=[];//Creating the array that holds all of the service objects
let mappingSettings=[];//Creating the array that holds all of the program mapping objects
let sentryServiceCount=[];//Creating the array that holds the service count for each sentry
let x=0;//value used for looping through the converted masterlist services
/*----------------------------------------------------Functions-----------------------------------------------------*/

const sentryConfigPromise = function ({percentPerSentry, sentrys}) {
  return new Promise((resolve, reject) => {
    console.log('\nSentry Configuration Running...');
    //conversion of master list file
    xlsxj({input: "./Sling Service Master List.xlsx", output: "./MasterList.json", sheet: "Master List"}, function(err, res){
      if (err){
        throw err;
        reject(err);
      }
      else{
        //Calculating the service per sentry load
        for(j=0; j<percentPerSentry.length; j++){
          sentryServiceCount.push(percentPerSentry[j]*res.length);
        };
        //console.log(sentryServiceCount);
        //configuring sentrys
        for(i=0; i<sentryServiceCount.length; i++){
          //Code will use variable for sentryName and then loop through quantity of services as determined by load balancing function
          //Running "for" loop to pass through result array and create service and mapping objects and then push them to their appropriate arrays
          let tekEth1Port = 0; //Setting the port for the tektronix equipment on eth 1 for each sentry cycle
          let tekEth2Port = 1000; //Setting the port for the tektronix equipment on eth 2 for each sentry cycle
          let tempServiceCount = 0; //Setting the quantity of services existing on the sentry for each cycle
          //while loop will end if we reach end of sentry service count or the end of our master list - this accounts for minor discreps between the two values
          while(tempServiceCount<sentryServiceCount[i] && res[x]){
            let result = res[x];//Set res to variable to use bracket notation
            let serviceEth1 = {
              sentryName: sentrys[i],
              portnum: tekEth1Port,
              sourceIp:result["SSM1"].trim(),
              groupAddr:result["MULTICAST"].trim(),
              destPort:parseInt(result["PORT"]),
              name:result["Sentry LAN2 PORT Name"].trim(),
              desc:result["SSM1"].trim()
            };
            let programMappingEth1 = {
              sentryName: sentrys[i],
              portNumber: tekEth1Port,
              programNumber: "-1",
              providerName: result["Sentry LAN2 PRGM Mapping"].trim(),
              userAdded:true
            };
            inputSettings.push(serviceEth1);//Pushing serviceEth1 object to inputSettings array
            mappingSettings.push(programMappingEth1);
            tekEth1Port++;//incrementing tektronix Eth1 port number
            let serviceEth2 = {
              sentryName: sentrys[i],
              portnum:tekEth2Port,
              sourceIp:result["SSM2"].trim(),
              groupAddr:result["MULTICAST"].trim(),
              destPort:parseInt(result["PORT"]),
              name:result["Sentry LAN3 PORT Name"].trim(),
              desc:result["SSM2"].trim()
            };
            let programMappingEth2 = {
              sentryName: sentrys[i],
              portNumber:tekEth2Port,
              programNumber: "-1",
              providerName: result["Sentry LAN3 PRGM Mapping"].trim(),
              userAdded:true
            };
            inputSettings.push(serviceEth2);//Pushing serviceEth2 object to inputSettings array
            mappingSettings.push(programMappingEth2);
            tekEth2Port++;//incrementing tektronix Eth2 port number
            x++;//on to next service in the masterlist
            tempServiceCount++;//increment this var to keep a runningtotal of the services on the sentry being currently configured
            // console.log(tempServiceCount);
            // console.log("\nthe current value inside the while loop of x is: " + x);
          };
          // console.log("\ncompleted dataset for Sentry: "+sentry[i]+"\n");
          //console.log("\nthe current value of x is: " + x);
        };
        // console.log(x+" should be equal to "+res.length);
        services2Add.inputSettings = inputSettings;//adding inputSettings array to the services2Add object which forms params of body post request
        programMappings.inputSettings = mappingSettings;//adding program mapping array to programMappings object which forms params of body post request
        const servicesFromExcel = {
          "jsonrpc":2.0,
          "method":"Input.UpdateMPEGInput",
          "params":services2Add,
          "id":5
        };
        const mappingFromExcel = {
          "jsonrpc":2.0,
          "method":"Program.SetProgramMapping",
          "params":programMappings,
          "id":6
        };
        fs.writeFile("./sentryConfigResults/servicesFromExcel.json", JSON.stringify(servicesFromExcel, undefined, 2), function(err){
          if(err) throw err;
        });
        fs.writeFile("./sentryConfigResults/mappingFromExcel.json", JSON.stringify(mappingFromExcel, undefined, 2), function(err){
          if(err) throw err;
        });
        // Code for posting data to Sentry through Medius
        request.post({
              url: mediusIP,
              headers: {"content-type": "application/json"},
              body: servicesFromExcel,
              json: true
            }, function(err, response, body){
              if (err) console.log(err);
              //console.log("This is the input configure body return: "+body);
              //console.log("\nConnection Success!\n");
              console.log("\nSentry Inputs configured");
              request.post({
                    url: mediusIP,
                    headers: {"content-type": "application/json"},
                    body: mappingFromExcel,
                    json: true
                  }, function(err, response, body){
                    if (err) console.log(err);
                    //console.log("This is the mapping configure body return: "+body);
                    //console.log("\nConnection Success!\n");*/
                    console.log("\nSentry Ports Configured");
                    console.log("\nSentry Programs mapped");
                    resolve("\nThe tektronix units have been configured - Thank you");
                  });
            });
      };
    });
  })
};

/*const sentryConfig = function ({percentPerSentry, sentrys}) {
  console.log('\nSentry Configuration Running...\n');
  //conversion of master list file
  xlsxj({input: "./Sling Service Master List.xlsx", output: "./MasterList.json", sheet: "Master List"}, function(err, res){
    if (err) throw err
    else{
      //Calculating the service per sentry load
      for(j=0; j<percentPerSentry.length; j++){
        sentryServiceCount.push(percentPerSentry[j]*res.length);
      };
      console.log(sentryServiceCount);
      //configuring sentrys
      for(i=0; i<sentryServiceCount.length; i++){
        //Code will use variable for sentryName and then loop through quantity of services as determined by load balancing function
        //Running "for" loop to pass through result array and create service and mapping objects and then push them to their appropriate arrays
        let tekEth1Port = 0; //Setting the port for the tektronix equipment on eth 1 for each sentry cycle
        let tekEth2Port = 1000; //Setting the port for the tektronix equipment on eth 2 for each sentry cycle
        let tempServiceCount = 0; //Setting the quantity of services existing on the sentry for each cycle
        //while loop will end if we reach end of sentry service count or the end of our master list - this accounts for minor discreps between the two values
        while(tempServiceCount<sentryServiceCount[i] && res[x]){
          let result = res[x];//Set res to variable to use bracket notation
          let serviceEth1 = {
            sentryName: sentrys[i],
            portnum: tekEth1Port,
            sourceIp:result["SSM1"].trim(),
            groupAddr:result["MULTICAST"].trim(),
            destPort:parseInt(result["PORT"]),
            name:result["Sentry LAN2 PORT Name"].trim(),
            desc:result["SSM1"].trim()
          };
          let programMappingEth1 = {
            sentryName: sentrys[i],
            portNumber: tekEth1Port,
            programNumber: "-1",
            providerName: result["Sentry LAN2 PRGM Mapping"].trim(),
            userAdded:true
          };
          inputSettings.push(serviceEth1);//Pushing serviceEth1 object to inputSettings array
          mappingSettings.push(programMappingEth1);
          tekEth1Port++;//incrementing tektronix Eth1 port number
          let serviceEth2 = {
            sentryName: sentrys[i],
            portnum:tekEth2Port,
            sourceIp:result["SSM2"].trim(),
            groupAddr:result["MULTICAST"].trim(),
            destPort:parseInt(result["PORT"]),
            name:result["Sentry LAN3 PORT Name"].trim(),
            desc:result["SSM2"].trim()
          };
          let programMappingEth2 = {
            sentryName: sentrys[i],
            portNumber:tekEth2Port,
            programNumber: "-1",
            providerName: result["Sentry LAN3 PRGM Mapping"].trim(),
            userAdded:true
          };
          inputSettings.push(serviceEth2);//Pushing serviceEth2 object to inputSettings array
          mappingSettings.push(programMappingEth2);
          tekEth2Port++;//incrementing tektronix Eth2 port number
          x++;//on to next service in the masterlist
          tempServiceCount++;//increment this var to keep a runningtotal of the services on the sentry being currently configured
          // console.log(tempServiceCount);
          // console.log("\nthe current value inside the while loop of x is: " + x);
        };
        // console.log("\ncompleted dataset for Sentry: "+sentry[i]+"\n");
        //console.log("\nthe current value of x is: " + x);
      };
      // console.log(x+" should be equal to "+res.length);
      services2Add.inputSettings = inputSettings;//adding inputSettings array to the services2Add object which forms params of body post request
      programMappings.inputSettings = mappingSettings;//adding program mapping array to programMappings object which forms params of body post request
      const servicesFromExcel = {
        "jsonrpc":2.0,
        "method":"Input.UpdateMPEGInput",
        "params":services2Add,
        "id":5
      };
      const mappingFromExcel = {
        "jsonrpc":2.0,
        "method":"Program.SetProgramMapping",
        "params":programMappings,
        "id":6
      };
      fs.writeFile("./sentryConfigResults/servicesFromExcel.json", JSON.stringify(servicesFromExcel, undefined, 2), function(err){
        if(err) throw err;
      });
      fs.writeFile("./sentryConfigResults/mappingFromExcel.json", JSON.stringify(mappingFromExcel, undefined, 2), function(err){
        if(err) throw err;
      });
      // Code for posting data to Sentry through Medius
      request.post({
            url: mediusIP,
            headers: {"content-type": "application/json"},
            body: servicesFromExcel,
            json: true
          }, function(err, response, body){
            if (err) console.log(err);
            //console.log("This is the input configure body return: "+body);
            //console.log("\nConnection Success!\n");
            console.log("\n\nSentry Inputs configured...");
          });
      request.post({
          url: mediusIP,
          headers: {"content-type": "application/json"},
          body: mappingFromExcel,
          json: true
        }, function(err, response, body){
          if (err) console.log(err);
          //console.log("This is the mapping configure body return: "+body);
          //console.log("\nConnection Success!\n");
          console.log("\n\nSentry Programs mapped");
        });
    };
  });
};*/

module.exports = sentryConfigPromise;
