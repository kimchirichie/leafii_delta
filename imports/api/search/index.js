import { Meteor } from 'meteor/meteor';

import { Keywords } from '../keywords/collection';
import { Words } from '../count/collection';

if (Meteor.isServer) {
	Meteor.publish('search', function(searchString){
		if (typeof searchString === 'string' && searchString.length) {
			var queries = searchString.split(" ");
			console.log(queries);
			var ranks = {};
			// var valWord = 0.0;

			for (let i = 0; i < queries.length; i++){
				keywords = Keywords.find({keyword:{$regex:`.*${queries[i]}.*`,$options:'i'}}).fetch();
				total = Words.findOne({word: queries[i]}).total;
				console.log(queries[i], total);
				points = 1/total;
				for (let j = 0; j < keywords.length;  j++){
					console.log(keywords[j]);
					if (!(keywords[j].user_id in ranks)){
						ranks[keywords[j].user_id] = points;
					} else {
						ranks[keywords[j].user_id] += points;
					}
				}
			}

			console.log(ranks);
			return this.ready();
		} else {
			return this.ready();
		}

	});
}