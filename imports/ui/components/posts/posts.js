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
    Meteor.call('deleteComment', timestamp, postId);
  }

  createPost() {
    Meteor.call('createPost', this.post.title, [], this.post.content);
    this.post = {};
    this.back();
  }

  updatePost() {
    Meteor.call('updatePost', this.post.timestamp, this.post.title, [], this.post.content);
  }

  deletePost() {
    Meteor.call('deletePost', this.post.timestamp);
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