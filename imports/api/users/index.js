import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	Meteor.publish('allUsers', function(){
		return Meteor.users.find({},{fields: {profile:1, createdAt: 1}});
	});
	Meteor.publish('potato', function(){
		return Meteor.users.find({},{});
	})

}