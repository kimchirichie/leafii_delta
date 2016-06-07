import { Mongo } from "meteor/mongo";

export const Profile = new Mongo.Collection('profile');


Profile.allow({

  insert(userId, user) {
    return userId && user.owner === userId;
  },

  update(userId, user, fields, modifier) {
    if (userId != user.owner){
    	return;
    }
    else{
    	return true;
    }
    
  },

  remove(userId, user) {
    if (userId != user.owner){
    	return;
    }
    else {
    	return true;
    }
    
  }

});


