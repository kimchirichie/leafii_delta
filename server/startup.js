import { Meteor } from 'meteor/meteor';
 
Meteor.startup(()=>{


	// var domain = 'support@leafii.com';
	var email = process.env.EMAIL;
	var password = process.env.PASSWORD;
	process.env.MAIL_URL = 'smtp://' + email + ':' + password + '@smtp.gmail.com:465/';

	const prerenderio = Npm.require('prerender-node');
    const settings = Meteor.settings.PrerenderIO;

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
		}
	});

});
