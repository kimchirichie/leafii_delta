import { Meteor } from 'meteor/meteor';

import { Logs } from '../logs/collection';

if (Meteor.isServer) {
	Meteor.publish('latest', function(searchString){
		return Logs.find({"type": "views"},{$sort:{"createdAt":-1}, $limit: 1});
	});
}

Blogs.allow({
	insert() {
		return Meteor.user().role=="admin";
	},
	update() {
		return Meteor.user().role=="admin";
	},
	remove(){
		return Meteor.user().role=="admin";
	}
})