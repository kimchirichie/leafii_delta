import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Posts } from './collection';
// List of profiles the user liked
if (Meteor.isServer) {
	Meteor.publish('posts', function(profile_id){
		return Posts.find({profile_user_id: profile_id});
	});
}

Posts.allow({
	insert(poster_user_id, title, tags, content, date, comments) {
		return true;
	},
	update(poster_user_id, title, tags, content, date, comments, fields, modifier) {
		return true;
	},
	remove(poster_user_id, title, tags, content, date, comments) {
		return true;		
	}
})