import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profile_likes } from './collection';
// List of profiles the user liked
if (Meteor.isServer) {
	Meteor.publish('users_profile_likes', function(){
		const selector = {clicker_user_id: this.userId};
		return Profile_likes.find(selector);
	});
}
// List of likes on the user's profile
if (Meteor.isServer) {
	Meteor.publish('my_profile_likes', function(){
		const selector = {liked_user_id: this.userId};
		return Profile_likes.find(selector);
	});
}

Profile_likes.allow({
	insert(clickerUserId, likedUserId, date, url) {
		return true;
	},
	remove(clickerUserId, likedUserId, date, url) {
		return true;		
	}
})