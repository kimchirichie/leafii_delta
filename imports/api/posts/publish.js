import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Posts } from './collection';
// List of profiles the user liked
if (Meteor.isServer) {
	Meteor.publish('posts', function(){
		return Posts.find({});
	});
}

Posts.allow({
	insert(poster_user_id, post) {
		return true;
	},
	update(poster_user_id, post, modifier) {
		return true;
	},
	remove(poster_user_id, post, comments) {
		return true;		
	}
})