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
    this.submitPost = false;
    this.post = {};
  }

  // createComment(postId, newComment) {
  //   console.log(postId, newComment);
  //   Meteor.call('createComment', postId, newComment);
  // }

  // editComment(timestamp, postId, comment) {
  //   Meteor.call('updateComment', timestamp, postId, comment);
  // }

  // deleteComment(timestamp, postId) {
  //   Meteor.call('deleteComment', timestamp, postId);
  // }

  // createPost() {
  //   Post.insert({asdfsadflksadfk:asdfsadf})
  //   Meteor.call('createPost', this.post.title, [], this.post.content);
  //   this.back();
  // }

  // updatePost(postDate, title, content, post) {
  //   post.update({$set:{asdfsadf}})
  //   Meteor.call('updatePost', postDate, title, [], content);
  // }

  // deletePost(postDate) {
  //   Meteor.call('deletePost', postDate);
  // }



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