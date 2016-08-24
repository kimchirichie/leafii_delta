import { Meteor } from 'meteor/meteor';

import { Logs } from './collection';
// List of profiles the user liked
if (Meteor.isServer) {
	Meteor.publish('latest_view', function(){
		return Logs.find({$query:{type:"view"},$orderby:{createdAt:-1}},{limit:1});
	});
	Meteor.publish('latest_search', function(){
		return Logs.find({$query:{type:"search"},$orderby:{createdAt:-1}},{limit:1});
	});
}

Logs.allow({
	insert(userId, doc) {
		return true;
	},
	update(userId, doc, fields, modifier) {
		// if(!userId) return false;
		// if(Meteor.user().role=="admin") return true;	
		return false;
	},
	remove(userId, doc) {
		// if(!userId) return false;
		// if(Meteor.user().role=="admin") return true;	
		return false;
	}
})