import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './posts.html';
import { Posts } from '../../../api/posts/index';

class Postings {
  constructor($scope, $reactive, $state, $sce){
    "ngInject";
    $reactive(this).attach($scope);
    this.state = $state;
    this.onfilter = 'recent';
    this.wait = false;
    this.submitPost = false;
    this.sce = $sce;
    Meteor.subscribe("posts");
    this.user = Meteor.user();
    this.helpers({
      allPosts(){
        return Posts.find({});
      }
    });
  }

  absolutify(url){
    return this.sce.trustAsResourceUrl('http://' + url.replace(/https:|http:|\/\//gi, ""));
  }

  back(){
    /*var self = this;
    confirmed = swal({
        title: "Are you sure?",
        text: "Your unfinished post will be forever lost.",
        type: "warning",
        // #DD6B55
        showCancelButton: true,
        confirmButtonColor: "#3edeaa",
        confirmButtonText: "Yes, abandon post!",        
        cancelButtonText: "Edit",
        closeOnConfirm: true
      }, function(){ 
        console.log("Closing new post");
      });*/

      this.submitPost = false;
      this.post = {};
  }

  createComment(postId, comment) {

    console.log('triggered');
    if(Meteor.userId()){
      user = Meteor.user();
      //date = Math.floor(Date.now() / 60000);
      //date + commenter_user_id will be the unique key combo for the comments for a profile
      date = Date.now();
      Posts.update({_id: postId}, {$addToSet: {comments: {commenter_user_id: user._id, name: user.profile.firstName + " " + user.profile.lastName, comment: comment, date: date, last_edit: 0}}}, false, false);
      newComment = '';
    }
  }

  editComment(timestamp, postId, comment) {
    if(Meteor.userId()){
      user = Meteor.userId();
      date = Math.floor(Date.now() / 60000);
      
      Posts.update({_id: postId, "comments.date": timestamp, "comments.commenter_user_id": user}, {$set:{"comments.$.comment": comment, "comments.$.last_edit": date}}, false, false);
    }
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
          //console.log(postId+ " " + user +" "+timestamp);
          Posts.update({_id: postId}, {$pull: {comments:{commenter_user_id: user, date: timestamp}}});
          Bert.alert('Comment deleted','success', 'growl-top-right');
        }
      });
  }

  createPost() {
    if(Meteor.userId()){
      user = Meteor.user();
      date = Date.now();
      Posts.insert({poster_user_id: user._id, title: this.post.title, tags: [], content: this.post.content, url: user.profile.url, name: user.profile.firstName + " " + user.profile.lastName, comments: [], date: date, last_edit: 0});
    }
    this.back();
  }

  editPost(title, content) {
    this.tempPost_title = title;
    this.tempPost_content = content;
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
          Posts.remove(postID);
          Bert.alert('Post deleted','success', 'growl-top-right');
        }
      });
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
      url: '/posts',
      template: '<posts></posts>'
    });
}