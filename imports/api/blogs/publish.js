import { Meteor } from 'meteor/meteor';

import { Blogs } from './collection';

if (Meteor.isServer) {
	Meteor.publish('blogs', function(searchString){
		return Blogs.find();
	});
}

Blogs.allow({
	insert() {
		return Meteor.user().profile.role=="admin";
	},
	update() {
		return Meteor.user().profile.role=="admin";
	},
	remove(){
		return Meteor.user().profile.role=="admin";		
	}
})