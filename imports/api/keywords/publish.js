import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Keywords } from './collection';

if (Meteor.isServer) {
	// Meteor.publish('keywords', function(options, searchString){
	Meteor.publish('keywords', function(searchString){
		const selector = {};//{userId:this.userId};
		if (typeof searchString === 'string' && searchString.length) {
			selector.keyword = {
				$regex: `.*${searchString}.*`,
				$options : 'i'
			};
		} else {
			return;
		}
		Counts.publish(this, 'numberOfKeywords', Keywords.find(selector),{noReady:true});
		return Keywords.find(selector);
	});
}