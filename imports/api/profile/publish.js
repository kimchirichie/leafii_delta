import { Meteor } from 'meteor/meteor';

import { Keywords } from '../keywords/collection';

if (Meteor.isServer) {
	Meteor.publish('mykeywords', function(){
		if(this.userId){
			return Keywords.find({user_id: this.userId});
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