import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profile_likes } from './collection';

if (Meteor.isServer) {
	Meteor.publish('likes', function(){
		const selector = {target_userId: this.userId};
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