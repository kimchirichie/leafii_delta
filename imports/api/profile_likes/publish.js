import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profile_likes } from './collection';
// List of profiles the user liked
if (Meteor.isServer) {
	Meteor.publish('profile_likes', function(){
		return Profile_likes.find();
	});
	
	Meteor.publish('my_profile_likes', function(){
		const selector = {liked_user_id: this.userId};
		return Profile_likes.find(selector);
	});
}

Profile_likes.allow({
	insert() {
		return (userId && true);
	},
	update(){
		return Meteor.user().role=="admin";
	},
	remove() {
		return (userId && true);		
	}
})