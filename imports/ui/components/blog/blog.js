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
		console.log("blog id: ",this.stateParams.blog_id);
		this.helpers({
			blogs(){
				return Blogs.find();
			},
			blog(){
				if(!this.stateParams.blog_id) return;
				return Blogs.findOne({_id:this.stateParams.blog_id});
			}
		});
		Meteor.subscribe("blogs");
	}
}

const name = 'blog';

export default angular.module(name, [
	angularMeteor,
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