import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Keywords } from '../keywords/collection';

if (Meteor.isServer) {
	Meteor.publish('search', function(searchString){
		// const selector = {};
		if (typeof searchString === 'string' && searchString.length) {
			// selector.keyword = {
			// 	$regex: `.*${searchString}.*`,
			// 	$options : 'i'
			// };

			var words = searchString.split(" ");
			console.log(words);
			for (let i = 0; i < words.length; i++){
				console.log(words[i]);
				console.log(Keywords.find({keyword:{$regex:`.*${words[i]}.*`,$options:'i'}}).fetch());
			}

			
			return Meteor.users.find({});
		} else {
			return;
		}

	});
}