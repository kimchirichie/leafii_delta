import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './potato.html';


class Potato {
	constructor($scope, $reactive, $state, $timeout, $rootScope){
		'ngInject';
		$reactive(this).attach($scope);
		this.rootScope = $rootScope;
		this.showing;
		this.editing;
		this.state = $state;
		this.wait = false;
		this.query = "";
		this.helpers({
			users(){
				var searchString = this.getReactively('query');
				const selector = {};
				if (typeof searchString === 'string' && searchString.length) {
					selector["$or"] = [];
					selector["$or"].push({
						"profile.firstName" : {
							$regex: `.*${searchString}.*`,
							$options : 'i'
						}
					});
					selector["$or"].push({
						"profile.lastName" : {
							$regex: `.*${searchString}.*`,
							$options : 'i'
						}
					});
					selector["$or"].push({
						"profile.url" : {
							$regex: `.*${searchString}.*`,
							$options : 'i'
						}
					});
					selector["$or"].push({
						"emails.address" : {
							$regex: `.*${searchString}.*`,
							$options : 'i'
						}
					});
				}
				return Meteor.users.find(selector);
			}
		});
		this.subscribe("users_all");
	}

	loccheck(user){
		if (user.profile.location && user.profile.location.formatted_address) {
			user.profile.location = user.profile.location.formatted_address;
			this.save(user);
			return "fix required. so fixed";
		}
	}

	display(user){
		user.showing = true;
	}

	showing(user){
		return user.showing;
	}

	edit(user){
		user.editing = true;
	}

	editing(user){
		return user.editing;
	}

	cancel(user){
		user.editing = false;
	}	

	close(user){
		user.showing = false;
		user.editing = false;
	}

	save(user){
		if(user.profile.location && user.profile.location.formatted_address){
			user.profile.location = user.profile.location.formatted_address;
		}
		Meteor.users.update({_id:user._id}, {
			$set: {
				"profile.url":user.profile.url,
				"profile.firstName": user.profile.firstName,
				"profile.lastName": user.profile.lastName,
				"emails[0].address":user.emails[0].address,
				"profile.occupation": user.profile.occupation,
				"profile.available": user.profile.available,
				"profile.image": user.profile.image,
				"profile.location" : user.profile.location
			}
		});
		user.editing = false;
	}

	delete(user){
		if(!confirm('Are you sure you want to delete this user?')) return;
		Meteor.users.remove(user._id);
	}

	send_verification(user){
		Meteor.call('verifyUser', user, function(error, response){
				
			if(error){
				Bert.alert(error.reason, 'danger', 'growl-top-right');
				this.timeout(function(){this.wait = false;}.bind(this), 1300);
						
					} 
			else {
				this.wait = false;
				Bert.alert('Verification email sent!', 'success', 'growl-top-right');
				}
		}.bind(this));
	}

	send_reset(email){
		this.wait = true;

		Accounts.forgotPassword({email: email}, function(error){

		  if(error){
			Bert.alert(error.reason, 'danger', 'growl-top-right');
			this.timeout(function(){this.wait = false;}.bind(this), 1300);
		  }
		  else {
			Bert.alert('Email Sent! Please check your email to reset password', 'success', 'growl-top-right');
			this.timeout(function(){this.wait = false;}.bind(this), 1300);
			this.email = '';
		  }

		}.bind(this));
	}

	reparse_user(user_id){
		confirmed = swal({
		title: "Are you sure?",
		text: "It will delete all the previous keywords & re-parse the user's website.",
		type: "warning",
		// #DD6B55
		showCancelButton: true,
		confirmButtonColor: "#3edeaa",
		confirmButtonText: "Yes, re-parse it!",
		closeOnConfirm: true
		},function(){
			Meteor.call('startCrawl', user_id, function (err, res) {
			  if (err) {
				Bert.alert('Keywords Update Failed', 'danger');
			  } else {
				Bert.alert('Keywords Updated','success')
			  }
			});
		})
	}

	reparse_all(){
		confirmed = swal({
		title: "Are you sure?",
		text: "It will delete all the previous keywords & re-parse all users' website.",
		type: "warning",
		// #DD6B55
		showCancelButton: true,
		confirmButtonColor: "#3edeaa",
		confirmButtonText: "Yes, re-parse it!",
		closeOnConfirm: true
		},function(){
			Meteor.call('allCrawl', function (err, res) {
			  if (err) {
				Bert.alert('Keywords Update Failed', 'danger');
			  } else {
				Bert.alert('Keywords Updated','success')
			  }
			});
		})

	}
}

const name = 'potato';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
	'google.places'
]).component(name, {
	template,
	controllerAs: name,
	controller: Potato
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('potato', {
			url: '/potato',
			template: '<potato></potato>',
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


