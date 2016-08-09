import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Views } from './collection';

if (Meteor.isServer) {
	Meteor.publish('views', function(){
		const selector = {target_userId: this.userId};
		// Counts.publish(this, 'numberOfViews', Views.find(selector),{noReady:true});
		return Views.find(selector);
	});
}

Views.allow({
	insert(userId, targetUserId, searchKeys, date, url) {
		return true;
	},
	remove(userId, targetUserId, searchKeys, date, url) {
		return true;		
	}
})