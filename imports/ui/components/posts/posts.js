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
    confirmed = swal({
        title: "Are you sure?",
        text: "Your unfinished post will be forever lost.",
        type: "warning",
        // #DD6B55
        showCancelButton: true,
        confirmButtonColor: "#3edeaa",
      confirmButtonText: "Yes, abandon post!",
        closeOnConfirm: true
      },this.backHelper());
  }

  backHelper(){
    this.submitPost = false;
    this.post = {};
  }

  createComment(postId, comment) {
    Meteor.call('createComment', postId, comment);
  }

  editComment(timestamp, postId, comment) {
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
        Meteor.call('deleteComment', timestamp, postId);
        Bert.alert('Comment deleted','success', 'growl-top-right');
      });
  }

  createPost() {
    Meteor.call('createPost', this.post.title, [], this.post.content);
    this.post = {};
    this.back();
  }

  updatePost(postDate, title, content) {
    Meteor.call('updatePost', postDate, title, [], content);
  }

  deletePost(postDate) {
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
        Meteor.call('deletePost', postDate);
        Bert.alert('Post deleted','success', 'growl-top-right');
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