//This is the master logic script for working with the Tektronix API
/*-----------------------------------------------------importScripts----------------------------------------------------*/
const getSentrys = require('./getSentrys.js');
const portStats = require('./portStats.js');
const clearPorts = require('./clearPorts.js');
const clearMappings = require('./clearMappings.js');
const sentryConfig = require('./sentryConfig.js');
const sentryStatus = require('./sentryStatus.js');
/*-----------------------------------------------------promiseChain----------------------------------------------------*/
getSentrys
	.then(res=>{
		return portStats(res)
	})
	.then(res=>{
		return clearPorts(res)
	})
	.then(res=>{
		return clearMappings(res)
	})
	.then(res=>{
		return sentryConfig(res)
	})
	.then(res=>{
		console.log(res);
	});
/*-----------------------------------------------------scriptRun----------------------------------------------------*/

