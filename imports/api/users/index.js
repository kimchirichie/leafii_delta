import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	Meteor.publish(null, function(){
		return Meteor.users.find({},{fields: {profile:1, createdAt: 1, role: 1}});
	});

	Meteor.publish('potato', function(searchString){
		const user = Meteor.users.findOne(this.userId);
		if(!user || user.role != "admin") return this.ready();

		const selector = {};
		if (typeof searchString === 'string' && searchString.length) {
			selector.profile.firstName = {
				$regex: `.*${searchString}.*`,
				$options : 'i'
			};
		}
		return Meteor.users.find(selector);
	});

	Meteor.users.allow({
		insert(userId, doc) {
			return true;
		},
		update(userId, doc, fields, modifier){
			if(!userId) return false;
			if(fields.indexOf("role") > -1) return false;
			const user = Meteor.users.findOne({_id: userId});
			return doc._id == userId || user.role == "admin";
		},
		remove(userId, doc){
			const user = Meteor.users.findOne({_id: userId});
			return user.role == "admin";
		}
	});
}