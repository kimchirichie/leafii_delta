import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Views } from './collection';

if (Meteor.isServer) {
	Meteor.publish('views', function(){
		const selector = {target_userId: this.userId};
		// Counts.publish(this, 'numberOfViews', Views.find(selector),{noReady:true});
		return Views.find(selector);
	});
	Meteor.publish('viewsThisWeek', function(){
		lastweek = Math.floor((Date.now() / 60000) - 10080);
		const selector = {target_userId: this.userId, date: {$gt: lastweek}};
		return Views.find(selector);
	});
}

Views.allow({
	insert() {
		return true;
	},
	update(){
		return Meteor.user().role=="admin";
	},
	remove() {
		return Meteor.user().role=="admin";		
	}
})