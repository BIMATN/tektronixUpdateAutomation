//Loop through all but last index of body.result
for(i=0;i<(body.result.length-1);i++){
  // console.log(body.result[i]);
  sentrys+=(body.result[i].ip_addr+',');
  };
//Add last index value of body.result to sentrys string without adding a trailing comma
sentrys+=(body.result[(body.result.length-1)].ip_addr);
// object below with sentry IPs retrieved above will be passed to the sentry Status function in the cli.js file
fs.writeFile("./getSentrysResults/sentrys.txt", sentrys, function(err){
  if(err) throw err;
});
