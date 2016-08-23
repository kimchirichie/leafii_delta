import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	Meteor.publish(null, function(){
		return Meteor.users.find({},{fields: {profile:1, createdAt: 1, role: 1}});
	});

	Meteor.publish('potato', function(){
		const user = Meteor.users.findOne(this.userId);
		if(user.role == "admin"){
			return Meteor.users.find({});
		} else {
			return this.ready();
		}
	});

	Meteor.users.allow({
		insert(userId, doc) {
			const user = Meteor.users.findOne({_id: userId});
			//console.log(user);
			return user.role == "admin";
		},
		update(userId, doc, fields, modifier){
			const user = Meteor.users.findOne({_id: userId});
			//console.log(user);
			return user.role == "admin";	
		},
		remove(userId, doc){
			const user = Meteor.users.findOne({_id: userId});
			//console.log(user.profile);
			return user.role == "admin";
		}
	});
}