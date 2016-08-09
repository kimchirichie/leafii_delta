import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Views } from './collection';

if (Meteor.isServer) {
	Meteor.publish('views', function(user){
		const selector = {target_userId:user};
		Counts.publish(this, 'numberOfViews', Views.find(selector),{noReady:true});
		return Views.find(selector);
	});
}

Views.allow({
	insert(userId, targetUserId, searchKeys, date) {
		return true;
	},
	remove(userId, targetUserId, searchKeys, date) {
		return true;		
	}
})