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
	insert(profile_user_id, comments) {
		return true;
	},
	update(profile_user_id, comments, fields, modifier) {
		return true;
	},
	remove(profile_user_id, comments) {
		return true;		
	}
})