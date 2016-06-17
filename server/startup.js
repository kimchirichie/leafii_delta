import { Meteor } from 'meteor/meteor';
import { Users } from '../imports/api/auth';
 
Meteor.startup(()=>{

	var domain = 'support@leafii.com';
	process.env.MAIL_URL = 'smtp://' + domain + ':deathology@smtp.gmail.com:465/';

	Meteor.methods({
		sendVerificationLink(){
			let userId = Meteor.userId();
			if(userId){
				return Accounts.sendVerificationEmail(userId);
			}
		}

	});

});