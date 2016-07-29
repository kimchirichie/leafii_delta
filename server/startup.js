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

		startCrawl(){
			var shell = new PythonShell('start_crawl.py', { scriptPath: '/root/Leafii/leafii_delta/scripts/' });
			// PythonShell.run('start_crawl.py', { scriptPath: '/root/Leafii/leafii_delta/scripts/' }, function (err) {
			//   if (err) throw err;
			//   console.log('finished');
			// });
			mesg = "a";
			shell.on('message', function (message) {
				// handle message (a line of text from stdout)
				console.log(message);
				mesg = message;
			});
			return mesg;
		}
	});

});
