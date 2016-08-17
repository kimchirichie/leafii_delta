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
			var rankUsr = {};
			var valWord = 0.0;
			for (let i = 0; i < queries.length; i++){
				// console.log(queries[i]);
				lstKeywords = Keywords.find({keyword:{$regex:`.*${words[i]}.*`,$options:'i'}}).fetch();
				valWord = Words.find({word: queries[i]}).total;
				for (j in lstKeywords){
					if (j._id in rankUsr){
						rankUsr.j._id.total = rankUsr.j_id.total + valWord;
					}
					else{
						rankUsr.j._id = {total : valWord}; 
					}
				}
				// console.log(Words.find({word:  queries[i]}));
				// console.log(Keywords.find({keyword:{$regex:`.*${words[i]}.*`,$options:'i'}}).fetch());
			}
			return rankUsr;
		} else {
			return;
		}

	});
}