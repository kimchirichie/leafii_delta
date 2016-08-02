import { Meteor } from 'meteor/meteor';
 
Meteor.startup(()=>{


	// var domain = 'support@leafii.com';
	var email = process.env.EMAIL;
	var password = process.env.PASSWORD;	
	process.env.MAIL_URL = 'smtp://' + email + ':' + password + '@smtp.gmail.com:465/';

	const prerenderio = Npm.require('prerender-node');
    const settings = Meteor.settings.PrerenderIO;
	var PythonShell = require('python-shell');
	var options = {
	  mode: 'text',
	  //pythonPath: 'path/to/python',
	  //pythonOptions: ['-u'],
	  scriptPath: '/root/Leafii/leafii_delta/scripts/',
	  //args: ['value1', 'value2', 'value3']
	};

    if (settings && settings.host) {
        prerenderio.set('host', settings.host);
        prerenderio.set('protocol', 'http');
        WebApp.rawConnectHandlers.use(prerenderio);
    }

	Meteor.methods({
		sendVerificationLink(){
			let userId = Meteor.userId();
			if(userId){
				return Accounts.sendVerificationEmail(userId);
			}
		},

		sendFeedback(to, from, subject, text){
			this.unblock();
			Email.send({
				to: to,
				from: from,
				subject: subject,
				text: text
			});
		},

		startCrawl(err, res){
			let userId = Meteor.userId();
			//var shell = new PythonShell('update_user_kws.py', { scriptPath: '/root/Leafii/leafii_crawler/crawler/', args: [userId] });

      		Future = Npm.require('fibers/future');
			var myFuture = new Future();	
			PythonShell.run('update_user_kws.py', { scriptPath: '/root/Leafii/leafii_crawler/crawler/', args: [userId] }, function (err, results) {
				if (err) {
			  		myFuture.throw(err);
				}
				else {
			  		console.log('Results: '+results);
			  		myFuture.return(results);
				}
			});
			console.log("User: "+userId);
			console.log(": ");
			// var msg = shell.on('message', function (message) {
			// 	// handle message (a line of text from stdout)
			// 	myFuture.return(message);
			// 	console.log(message);
			// });
			return myFuture.wait();
		}
	});

});
