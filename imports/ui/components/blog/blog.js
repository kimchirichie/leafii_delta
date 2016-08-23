import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './blog.html';
import { Blogs } from '../../../api/blogs/index';

class Blog {
	constructor($scope, $reactive, $stateParams){
		'ngInject';
		$reactive(this).attach($scope);
		this.stateParams = $stateParams;
		this.helpers({
			blogs(){
				if(this.stateParams.blog_id) return;
				return Blogs.find();
			},
			blog(){
				if(!this.stateParams.blog_id) return;
				var blog = Blogs.findOne({_id:this.stateParams.blog_id});
				if (blog){
					DocHead.removeDocHeadAddedTags()
					DocHead.setTitle("Leafii | " + blog.title);
				} 
				return blog;
			}
		});
		Meteor.subscribe("blogs");
	}
}

const name = 'blog';

export default angular.module(name, [
  angularMeteor,
  'ngSanitize',
  uiRouter,
]).component(name, {
	template,
	controllerAs: name,
	controller: Blog
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('blog', {
			url: '/blog/:blog_id',
			template: '<blog></blog>'
		});
}