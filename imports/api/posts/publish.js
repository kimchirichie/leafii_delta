import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Posts } from './collection';
// List of profiles the user liked
if (Meteor.isServer) {
	Meteor.publish('posts', function(){
		return Posts.find({});
	});

	Meteor.publish('latest_post',function(){
		return Posts.find({$query:{},$orderby:{date:-1}},{limit:1});
	});
}

Posts.allow({
	insert(userId, doc) {
		return !!userId;
	},
	update(userId, doc, fields, modifier) {
		if(!userId) return false;
		if(Meteor.user().role=="admin") return true;
		if(doc.poster_user_id == userId) return true;
		if(modifier.$addToSet && modifier.$addToSet.comments && modifier.$addToSet.comments.commenter_user_id == userId && fields.length == 1 && fields[0] == "comments") return true;
		if(modifier.$addToSet && modifier.$addToSet.upvotes && modifier.$addToSet.upvotes.user == userId && fields.length == 1 && fields[0] == "upvotes") return true;
		if(modifier.$pull && modifier.$pull.upvotes.user == userId && fields.length == 1 && fields[0] == "upvotes") return true;	
		return false;
	},
	remove(userId, doc) {
		return Meteor.user().role=="admin";		
	}
})