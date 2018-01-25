//This is a master logic script for working with Tektronix APIs
/*-----------------------------------------------------Variables----------------------------------------------------*/
const fs = require('fs');
const inquirer = require('inquirer');
const excel = require('xlsx');
const request = require('request');
const mediusIP = require('./connection.js');
const getSentrys = require('./getSentrys.js');
const sentryStatus = require('./sentryStatus.js');
/*----------------------------------------------------Introduction Message-----------------------------------------------------*/
console.log('\n||------------------------------------------------------------------------------------------------||\n 				Welcome to the Tektronix API Interface\n||------------------------------------------------------------------------------------------------||\n\n 	In this application you can: \n\n 	1. Retrieve the latest bandwidth and/or load reports from our Tektronix equipment \n 	2. Update and configure the Tetkronix equipment as part of our channel launch process\n\n<<------------------------------------------------------------------------------------------------>>\n If you have questions or concerns, comments, or general feedback please contact Benjamin Rodriguez\n\n');
/*----------------------------------------------------Run Prompt For User Choice of Operation-----------------------------------------------------*/
inquirer.prompt([
		{
			type: 'list',
			name: 'chooseOperation',
			message: 'Please select which function you would like to perform:',
			choices:['Status Reports','Channel Launch']
		}
	]).then(function(answer){
		switch(answer.chooseOperation){
			case 'Status Reports':
				sentryStatus();
			break;
			case 'Channel Launch':
				getSentrys();
			break;
			default:
				console.log('System Error: switch statement in response to first inquirer answer has failed');
		}
	});
