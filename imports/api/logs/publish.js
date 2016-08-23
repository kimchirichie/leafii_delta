import { Meteor } from 'meteor/meteor';

import { Logs } from './collection';
// List of profiles the user liked
if (Meteor.isServer) {
	Meteor.publish('logs', function(){
		return Logs.find({});
	});
}

Logs.allow({
	insert(userId, doc) {
		return true;
	},
	update(userId, doc, fields, modifier) {
		if(!userId) return false;
		if(Meteor.user().role=="admin") return true;	
		return false;
	},
	remove(userId, doc) {
		if(!userId) return false;
		if(Meteor.user().role=="admin") return true;	
		return false;
	}
})