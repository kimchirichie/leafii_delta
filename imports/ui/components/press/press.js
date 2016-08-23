import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './press.html';
import { Blogs } from '../../../api/blogs/index';

class Press {
	constructor($scope, $reactive){
		'ngInject';
		$reactive(this).attach($scope);
		this.posting = false;
		this.blog_id;
		this.helpers({
			blogs(){
				return Blogs.find();
			},
			blog(){
				return Blogs.findOne({_id:this.getReactively('blog_id')});
			}
		});
		Meteor.subscribe("blogs");
	}

	new(){
		this.posting = true;
		this.blog = {};
	}

	publish(blog){
		if(blog._id){
			this.update(blog);
		} else {
			Blogs.insert({title:blog.title, content:blog.content, createdAt: new Date()});
			Bert.alert("Blog published","success", "growl-top-right");
			this.close();
		}
	}

	edit(blog){
		this.posting = true;
		this.blog_id = blog._id;
	}

	update(blog){

		confirmed = swal({
	        title: "Are you sure?",
	        text: "This will update this blog",
	        type: "warning",
	        // #DD6B55
	        showCancelButton: true,
	        confirmButtonColor: "#3edeaa",
	        confirmButtonText: "Yes, update it!",
	        closeOnConfirm: true
	      },function(){
	      	  Blogs.update({_id:blog._id},{$set:{title:blog.title, content:blog.content, updatedAt: new Date()}})
			  Bert.alert("Blog updated","success", "growl-top-right");
			  this.close();
	    }.bind(this));
		
	}

	delete(blog){

		confirmed = swal({
	        title: "Are you sure?",
	        text: "This will discard the changes",
	        type: "warning",
	        // #DD6B55
	        showCancelButton: true,
	        confirmButtonColor: "#3edeaa",
	        confirmButtonText: "Yes, delete it!",
	        closeOnConfirm: true
	      },function(){
	      	  Blogs.remove({_id:blog._id});
	      	  this.close();
	          Bert.alert("Blog deleted","success", "growl-top-right");
	    }.bind(this));

	}

	close(){
		this.posting = false;
		this.blog_id = undefined;
		this.blo = {};
	}

	cancel(){

		confirmed = swal({
	        title: "Are you sure?",
	        text: "This will discard the changes",
	        type: "warning",
	        // #DD6B55
	        showCancelButton: true,
	        confirmButtonColor: "#3edeaa",
	        confirmButtonText: "Yes, discard it!",
	        closeOnConfirm: true
	      },function(){
	          this.close();
	          Bert.alert('Blog deleted','success', 'growl-top-right');
	    }.bind(this));
	}
}

const name = 'press';

export default angular.module(name, [
	angularMeteor,
	'ngSanitize',
	uiRouter,
]).component(name, {
	template,
	controllerAs: name,
	controller: Press
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('press', {
			url: '/press',
			template: '<press></press>',
			resolve: {
				admin: function ($q) {
					var defer = $q.defer();
					Meteor.setTimeout(function(){
						var user = Meteor.user();
						if(user && user.role == 'admin'){
							defer.resolve()
						} else {
							if(user){
								defer.reject("Only admins can access this page. Access denied");
							} else {
								defer.reject("You must be logged in as admin to access this page. Access denied");
							}
						}
					},1000)
					return defer.promise;
				}
			}
		});
}