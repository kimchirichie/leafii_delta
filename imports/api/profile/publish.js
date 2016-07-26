import { Meteor } from 'meteor/meteor';

import { Keywords } from '../keywords/collection';

if (Meteor.isServer) {
	Meteor.publish('mykeywords', function(){
		if(this.userId){
			var selector = {user_id: this.userId};
			return Keywords.find(selector);
		} else {
			this.ready();
		}
	});
}

Keywords.allow({
	insert(userId, keyword) {
		return true;
	},
	remove(userId, keyword){
		return true;		
	}
})