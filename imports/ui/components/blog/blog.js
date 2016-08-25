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
		this.blogReady = false;
		this.helpers({
			blogs(){
				this.blogReady = true;
				var blog = Blogs.findOne({_id:this.stateParams.blog_id});
				if(blog){
					console.log('single');
					DocHead.removeDocHeadAddedTags();
					DocHead.setTitle((blog.title || "Blog") + " - Leafii");
					return [blog];

				} else {
					if (this.stateParams.blog_id){
						console.log('no such blog');
						return;
					} else {
						console.log('many blogs')
						return Blogs.find();
					}
				}
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