import { Meteor } from 'meteor/meteor';

import { Keywords } from '../keywords/collection';
import { Words } from '../count/collection';

if (Meteor.isServer) {
	Meteor.publish('search', function(searchString){
		// const selector = {};
		if (typeof searchString === 'string' && searchString.length) {
			// selector.keyword = {
			// 	$regex: `.*${searchString}.*`,
			// 	$options : 'i'
			// };

			var queries = searchString.split(" ");
			console.log(queries);
			for (let i = 0; i < queries.length; i++){
				console.log(queries[i]);
				console.log(Words.find({word:  queries[i]}));
				// console.log(Keywords.find({keyword:{$regex:`.*${words[i]}.*`,$options:'i'}}).fetch());
			}

			
			return;
		} else {
			return;
		}

	});
}