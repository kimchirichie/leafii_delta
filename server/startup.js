import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import { Views } from '../imports/api/views/index';
import { Profile_likes } from '../imports/api/profile_likes/index';
import { Posts } from '../imports/api/posts/index';
import { Keywords } from '../imports/api/keywords/index';
import { Words } from '../imports/api/count/index';

Meteor.startup(()=>{

	// var domain = 'support@leafii.com';
	var email = process.env.EMAIL;
	var password = process.env.PASSWORD;	
	process.env.MAIL_URL = 'smtp://' + email + ':' + password + '@smtp.gmail.com:465/';

	const prerenderio = Npm.require('prerender-node');
    const settings = Meteor.settings.PrerenderIO;
	var PythonShell = require('python-shell');
	var options = {
	  mode: 'text'
	};

    if (settings && settings.host) {
        prerenderio.set('host', settings.host);
        prerenderio.set('protocol', 'http');
        WebApp.rawConnectHandlers.use(prerenderio);
    }

	Meteor.methods({
		sendVerificationLink(){
			let userId = Meteor.userId();
			if(userId){
				return Accounts.sendVerificationEmail(userId);
			}
		},

		sendFeedback(to, from, subject, text){
			this.unblock();
			Email.send({
				to: to,
				from: from,
				subject: subject,
				text: text
			});
		},

		startCrawl(err, res){
			let userId = Meteor.userId();
			//var shell = new PythonShell('update_user_kws.py', { scriptPath: '/root/Leafii/leafii_crawler/crawler/', args: [userId] });

      		Future = Npm.require('fibers/future');
			var myFuture = new Future();	
   			var crawler_src = process.env.CRAWLERSRC;
			PythonShell.run('update_user_kws.py', { scriptPath: crawler_src+'crawler/', args: [userId] }, function (err, results) {
				if (err) {
			  		myFuture.throw(err);
				}
				else {
					for (i = 0; i < results.length; i++)
					{
						if(results[i].indexOf("Error") > -1) {
			  				console.log('Results: '+results);
			  				break;
			  			}
			  		}
			  		myFuture.return(results);
				}
			});
			// var msg = shell.on('message', function (message) {
			// 	// handle message (a line of text from stdout)
			// 	myFuture.return(message);
			// 	console.log(message);
			// });
			return myFuture.wait();
		},

		addToViews(target_userId, search_Keys, url){
 			user = "guest";
			if(Meteor.userId()){
				user = Meteor.userId();
			}
			date = Math.floor(Date.now() / 60000);
			data = {
				user_id: user, 
				target_user_id: target_userId,
				search_keys: search_Keys, 
				date: date,
				url: url
			};
			Views.insert(data);
			Meteor.users.update(target_userId, {$inc: {"profile.views": 1}}, false, false);
		},

		likeProfile(liked_userId, url){
			if(Meteor.userId()){
				user = Meteor.userId();
				//console.log(Profile_likes.find({clicker_user_id: user, liked_user_id: liked_userId}).count());
				//console.log(user+" ; "+liked_userId);
				date = Math.floor(Date.now() / 60000);
				data = {
					clicker_user_id: user, 
					liked_user_id: liked_userId,
					date: date,
					url: url
				};
				//console.log("Add like");
				Profile_likes.insert(data);
				Meteor.users.update({_id:liked_userId}, {$addToSet: {"profile.likes": user}}, false, false);
				
			}
		},
		
		unlikeProfile(liked_userId){
			if(Meteor.userId()){
				user = Meteor.userId();
				//console.log(Profile_likes.find({clicker_user_id: user, liked_user_id: liked_userId}).count());
				//console.log(user+" ; "+liked_userId);
				data = {
					clicker_user_id: user, 
					liked_user_id: liked_userId,
				};
				//console.log("Delete like");
				Profile_likes.remove(data);
				Meteor.users.update({_id:liked_userId}, {$pull: {"profile.likes": user}}, false, false);
			}
		},

		createComment(post_id, comment){
			if(Meteor.userId()){
				user = Meteor.userId();
				//date = Math.floor(Date.now() / 60000);
				//date + commenter_user_id will be the unique key combo for the comments for a profile
				date = Date.now();

				console.log(Posts.find({}).fetch());
				Posts.update({_id: post_id}, {$addToSet: {comments: {commenter_user_id: user, comment: comment, date: date, last_edit: 0}}}, false, false);
			}
		},

		updateComment(original_timestamp, post_id, comment){
			if(Meteor.userId()){
				user = Meteor.userId();
				date = Math.floor(Date.now() / 60000);
				
				Posts.update({_id: post_id, "comments.date": original_timestamp, "comments.commenter_user_id": user}, {$set:{"comments.$.comment": comment, "comments.$.last_edit": date}}, false, false);
			}
		},

		deleteComment(original_timestamp, post_id){
			if(Meteor.userId()){
				user = Meteor.userId();
				
				Posts.update({_id: post_id, "comments.date": original_timestamp, "comments.commenter_user_id": user}, {$pull: {comments:{commenter_user_id: user, date: original_timestamp }}}, false, false);
			}
		},

		createPost(title, tags, content){
			if(Meteor.userId()){
				user = Meteor.user();
				date = Date.now();
				Posts.insert({poster_user_id: user._id, title: title, tags: tags, content: content, url: user.profile.url, name: user.profile.firstName + " " + user.profile.lastName, comments: [], date: date, last_edit: 0});

				console.log(Posts.find({}).fetch());
			}
		},

		updatePost(original_timestamp, title, tags, content){
			if(Meteor.userId()){
				user = Meteor.userId();
				date = Math.floor(Date.now() / 60000);
				
				Posts.update({poster_user_id: user, date: original_timestamp}, {$set:{title: title, tags: tags, content: content, last_edit: date}}, false, false);
			}
		},

		deletePost(original_timestamp){
			if(Meteor.userId()){
				user = Meteor.userId();
				
				Posts.remove({poster_user_id: user, date: original_timestamp});
			}
		},

		search(searchString){
			console.log(searchString);

			// send illegitimate queries empty back
			if (typeof searchString !== 'string') return [];
			if (!searchString.length) return [];

			var ranks = {};
			// var points = 0;
			var queries = searchString.split(" ");

			for (i in queries){
				var keywords = Keywords.aggregate([
						{$match:{keyword:{$regex:`.*${queries[i]}.*`,$options:'i'}}},
						{$project:{_id:0,user_id:1,keyword:1}}
					]);
				if (!keywords.length) continue;
				var distinct = keywords.map(function(keyword){
						return keyword.keyword;
					}).filter(function(value, index, self) { 
						return self.indexOf(value) === index;
					});
				var total = Words.aggregate([
						{$match:{word:{$in:distinct}}},
						{$project:{_id:0,total:1,word:1}}
					]);
				var points = {};
				for (j in total){
					points[total[j].word] = 1/total[j].total;
				}

				for(k in keywords){
					if(!(keywords[k].user_id in ranks)){
						ranks[keywords[k].user_id] = {
							points: points[keywords[k].keyword],
							keywords: [keywords[k].keyword]
						};
					} else {
						ranks[keywords[k].user_id].points += points[keywords[k].keyword];
						ranks[keywords[k].user_id].keywords.push(keywords[k].keyword);
					}
				}

			}

			if(!Object.keys(ranks).length) return [];

			var result = Meteor.users.aggregate([
					{$match:{_id:{$in: Object.keys(ranks)}}},
					{$project:{profile:1}}
				]).map(function(user){
					user.points = ranks[user._id].points;
					user.keywords = ranks[user._id].keywords;
					return user
				});
			console.log(result);
			// Session.set("result", result);
			return result
		}
	});
});