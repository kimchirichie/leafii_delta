import { Meteor } from 'meteor/meteor';
import { Users } from '../imports/api/auth';
 
Meteor.startup(()=>{
    //Mailgun is in sandbox mode
    //Make sure to add emails to authorized list on mailgun
    var domain = 'postmaster%40sandboxc9d1f0fa0e8c490ea014c33b565e66a7.mailgun.org'
	process.env.MAIL_URL = 'smtp://' + domain + ':6ba5e19642f9d659388ee14880dd3283@smtp.mailgun.org:587';
});

Meteor.methods({
    sendVerificationLink(){
      let userId = Meteor.userId();
      if (userId){
        return Accounts.sendVerificationEmail(userId);
      }
    }

});

// Email.send({
//     to:'yongli.iss2016@gmail.com',
//     from: 'from.address@mail.com',
//     subject: 'Email verification from Leafii',
//     text: 'this is email verification from leafii',
// });