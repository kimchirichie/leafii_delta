import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './posts.html';
import { Posts } from '../../../api/posts/index';

class Postings {

	constructor($scope, $reactive, $state, $sce, $rootScope, $stateParams){
		"ngInject";
		$reactive(this).attach($scope);
		this.stateParams = $stateParams;
		this.rootScope = $rootScope;
		this.state = $state;
		this.sce = $sce;
		this.submitPost = false;
		this.postsReady = false;
		this.hideNewComment = false;
		this.tab = (this.stateParams.post_id ? 'single' : 'browse');
		this.cardFilter = '-date';
		this.onfilter = 'latest';
		this.helpers({
			posts(){
				if(this.stateParams.post_id) return;
				this.postsReady = true;
				return Posts.find({deleted: false});
			},
			post(){
				if(!this.stateParams.post_id) return;
				var post = Posts.findOne({_id:this.stateParams.post_id});
				if (post){
					DocHead.removeDocHeadAddedTags()
					DocHead.setTitle("Leafii | " + post.title);
				} 
				return post;
			}
		});
		Meteor.subscribe("posts");
	}

	openTab(tab){
		this.tab = tab;
	}

	tabOpen(tab){
		return this.tab == tab;
	}

	upvoteComment(postId, commenterId, timestamp){
		if(Meteor.userId()){
			Meteor.call('likeComment', postId, commenterId, timestamp);
		} else {
			Bert.alert('You need to be signed in to like comments', 'danger', 'growl-top-right');
		}
		
	}

	upvotePost(postId) {
		if(Meteor.userId()){
			if(Meteor.userId()){
				user = Meteor.userId();
				if(Posts.find({_id: postId, "upvotes.user": user}).count())
				{
					Posts.update({_id:postId}, {$pull: {upvotes: {user: user}}}, false, false);
				}
				else
				{
					date = Math.floor(Date.now() / 60000);
					Posts.update({_id:postId}, {$addToSet: {upvotes: {user: user, date: date}}}, false, false);
				}
			}
		} else {
			Bert.alert('You need to be signed in to like posts', 'danger', 'growl-top-right');
		}
		
	}

	absolutify(url){
		return this.sce.trustAsResourceUrl('http://' + url.replace(/https:|http:|\/\//gi, ""));
	}

	cancel(){
		if(confirm("Are you sure you want to cancel? Your content will be lost")){
			this.submitPost = false;
			this.post = {};
			this.openTab('browse');
		}
	}

	createComment(postId) {

		if(Meteor.userId()){
			user = Meteor.user();
			date = new Date();
			Posts.update({_id: postId}, {$addToSet: {comments: {commenter_user_id: user._id, name: user.profile.firstName, comment: this.newComment, createdAt: date, last_edit: 0, upvotes: []}}}, false, false);
			this.newComment = '';
		} else {
			Bert.alert("Please login to comment", 'danger', 'growl-top-right');
			this.state.go('signin');
		}
	}

	editComment(timestamp, postId, comment) {
		this.hideNewComment = false;
		Meteor.call('updateComment', timestamp, postId, comment);
	}

	deleteComment(timestamp, postId) {

		confirmed = swal({
				title: "Are you sure?",
				text: "This will delete your comment.",
				type: "warning",
				// #DD6B55
				showCancelButton: true,
				confirmButtonColor: "#3edeaa",
				confirmButtonText: "Yes, delete it!",
				closeOnConfirm: true
			},function(){
				if(Meteor.userId()){
					user = Meteor.userId();
					//Posts.update({_id: postId}, {$pull: {comments:{commenter_user_id: user, date: timestamp}}});
					Meteor.call('tagDeleteComment', timestamp, postId);
					Bert.alert('Comment deleted','success', 'growl-top-right');
				}
			});
	}

	createPost() {

		if(Meteor.userId()){
			//Check for word limit
			if(!this.post.title || !this.post.content){
				Bert.alert("Word limit exceeded", 'danger', 'growl-top-right');
			}else {
				user = Meteor.user();
				date = Date.now();
				Posts.insert({poster_user_id: user._id, title: this.post.title, tags: [], content: this.post.content, url: user.profile.url, name: user.profile.firstName, comments: [], date: date, last_edit: 0, upvotes: [], deleted: false});
				this.cancel();
			}
			
		}
	}

	editPost(title, content) {
		this.tempPost_title = title;
		this.tempPost_content = content;
	}

	editUserComment(comment){
		this.temp_comment = comment;
	}

	updatePost(postID, title, content) {

		if(Meteor.userId()){
			user = Meteor.userId();
			date = Math.floor(Date.now() / 60000);
			Posts.update({_id: postID}, {$set:{title: title, tags: [], content: content, last_edit: date}}, false, false); 
		}
	}

	deletePost(postID) {
		confirmed = swal({
				title: "Are you sure?",
				text: "This will delete the post and all its comments.",
				type: "warning",
				// #DD6B55
				showCancelButton: true,
				confirmButtonColor: "#3edeaa",
				confirmButtonText: "Yes, delete it!",
				closeOnConfirm: true
			},function(){
				if(Meteor.userId()){
					Posts.update({_id: postID}, {$set:{deleted: true}}, false, false); 
					Bert.alert('Post deleted','success', 'growl-top-right');
				}
			});
	}

	// loginCheck(){
	// 	if(!Meteor.userId()){
	// 		Bert.alert('You need to signed in to post!', 'danger');
	// 		this.submitPost = false;
	// 		this.post = {};
	// 	} else {
	// 		this.submitPost = true;
	// 	}
	// }

	upvotedCheck(upvotes, id){
		for(var i = 0; i < upvotes.length; i++){
			if(upvotes[i].user == id){
				return true;
			}
		}
		return false;
	}

	getTimeElapsed(timestamp, isInMinutes){
		var then = new Date(0);
		if(isInMinutes)      
			then.setUTCMinutes(timestamp);
		else
			then.setUTCMilliseconds(timestamp);
		var now = new Date();
		var delta = now - then;
		var years = now.getFullYear() - then.getFullYear();
		var months = (years) * 12 + (now.getMonth() - then.getMonth());
		var days = Math.round(delta / 86400000);
		var hours = Math.round(delta / 3600000);
		var minutes = Math.round(delta / 60000);
		if(years > 0){
			if(years > 1)
				return "" + years + " years ago";
			else
				return "" + years + " year ago";        
		}
		else if(months > 0){
			if(months > 1)
				return "" + months + " months ago";
			else
				return "" + months + " month ago"; 
		}
		else if(days > 0){
			if(days > 1)
				return "" + days + " days ago";
			else
				return "" + days + " day ago";
		}
		else if(hours > 0){
			if(hours > 1)
				return "" + hours + " hours ago";
			else
				return "" + hours + " hour ago"; 
		}
		else if(minutes > 0){
			if(minutes > 1)
				return "" + minutes + " minutes ago";
			else
				return "" + minutes + " minute ago";
		}
		else{
			return "Now";
		}
	}

}

const name = 'posts';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
]).component(name, {
	template,
	controllerAs: name,
	controller: Postings
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('posts', {
			url: '/posts/:post_id',
			template: '<posts></posts>'
		});
}