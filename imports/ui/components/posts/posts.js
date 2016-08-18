import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './posts.html';
import { Posts } from '../../../api/posts/index';

class Postings {
  constructor($scope, $reactive, $state, $sce, $rootScope){
    "ngInject";
    $reactive(this).attach($scope);
    this.state = $state;
    this.submitPost = false;
    this.onfilter = 'latest';
    this.sce = $sce;
    this.rootScope = $rootScope;
    this.hideNewComment = false;
    Meteor.subscribe("posts");
    this.user = Meteor.user();
    this.helpers({
      allPosts(){
        return Posts.find({});
      }
    });
  }

  upvoteComment(postId, commenterId, timestamp){
    Meteor.call('likeComment', postId, commenterId, timestamp);
  }

  upvotePost(postId) {
    Meteor.call('likePost', postId);
  }

  absolutify(url){
    return this.sce.trustAsResourceUrl('http://' + url.replace(/https:|http:|\/\//gi, ""));
  }

  cancelNewPost(){
    this.submitPost = false;
    this.post = {};
  }

  createComment(postId) {

    if(Meteor.userId()){
      user = Meteor.user();
      date = Date.now();
      Posts.update({_id: postId}, {$addToSet: {comments: {commenter_user_id: user._id, name: user.profile.firstName + " " + user.profile.lastName, comment: this.newComment, date: date, last_edit: 0, upvotes: []}}}, false, false);
      this.newComment = '';
    } else {
      Bert.alert("Please login to comment", 'warning', 'growl-top-right');
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
          Posts.update({_id: postId}, {$pull: {comments:{commenter_user_id: user, date: timestamp}}});
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
        Posts.insert({poster_user_id: user._id, title: this.post.title, tags: [], content: this.post.content, url: user.profile.url, name: user.profile.firstName + " " + user.profile.lastName, comments: [], date: date, last_edit: 0, upvotes: []});
        this.cancelNewPost();
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
          Posts.remove(postID);
          Bert.alert('Post deleted','success', 'growl-top-right');
        }
      });
  }

  likePost(postId){
    if(Meteor.userId()){
      
    }
    else
      Bert.alert('You need to log in to do that!', 'danger');
  }

  loginCheck(){
    if(!Meteor.userId())
    {
      Bert.alert('You need to log in to do that!', 'danger');
      this.submitPost = false;
      this.post = {};
    }
    else
    {
      this.submitPost = true;
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
      url: '/posts',
      template: '<posts></posts>'
    });
}