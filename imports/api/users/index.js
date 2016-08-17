import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	Meteor.publish('allUsers', function(){
		return Meteor.users.find({},{fields: {profile:1, createdAt: 1}});
	});

	Meteor.publish('potato', function(){
		const user = Meteor.users.findOne(this.userId);
		if(user.profile.role == "admin"){
			return Meteor.users.find({});
		} else {
			return this.ready();
		}
	});

	Meteor.users.allow({
		insert(userId, doc) {
			const user = Meteor.users.findOne({_id: userId});
			console.log(user);
			return user.profile.role == "admin";
		},
		update(userId, doc, fields, modifier){
			const user = Meteor.users.findOne({_id: userId});
			console.log(user);
			return user.profile.role == "admin";	
		},
		remove(userId, doc){
			const user = Meteor.users.findOne({_id: userId});
			console.log(user.profile);
			return user.profile.role == "admin";
		}
	});
}