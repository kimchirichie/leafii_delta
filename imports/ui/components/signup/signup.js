import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor'
import template from './signup.html';



class Signup { 
	constructor($scope, $reactive, $state, $timeout, $rootScope){
		'ngInject';

		$reactive(this).attach($scope);
		this.state = $state;
		this.wait = false;
		this.timeout = $timeout;
		this.rootScope = $rootScope;
		this.rootScope.$broadcast('disableSearch');
		
	}

	facebook(){
		Meteor.loginWithFacebook({requestPermissions: ['user_friends', 'public_profile', 'email']}, function(err){
			if (err) {
				Bert.alert('Could Not Log In To Facebook', 'danger', 'growl-top-right');
				console.log(err);
			} else {
				Meteor.call('fbimport');
				this.state.go('profile');
				console.log('suceess');
			}
		}.bind(this));
	}

	submit(user){

		this.wait = true;
		user.profile.available = false;
		user.profile.views = 0;
		user.profile.likes = [];

		if (this.confirm !== user.password){
			Bert.alert('Your password does not match', 'danger', 'growl-top-right');
			user.password = '';
			this.confirm = '';
			this.timeout(function(){this.wait = false;}.bind(this), 1300);
			return;
		}

		Accounts.createUser(user, function(error){
			if(error) {
				Bert.alert(error.reason, 'danger', 'growl-top-right');
				this.timeout(function(){this.wait = false;}.bind(this), 1300);
			} 
			else {
				Meteor.call('sendVerificationLink', function(error, response){
					
					if(error){
						Bert.alert(error.reason, 'danger', 'growl-top-right');
						this.timeout(function(){this.wait = false;}.bind(this), 1300);
						
					} else {
						user = {};
						this.wait = false;
						this.state.go('welcome');
						Bert.alert('Verification email sent!', 'success', 'growl-top-right');
						Meteor.logout();
					}
				}.bind(this));
			}
		}.bind(this));
	}
}

const name = 'signup';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
	'accounts.ui',
	'google.places'
]).component(name, {
	template,
	controllerAs: name,
	controller: Signup
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('signup', {
			url: '/signup',
			template: '<signup></signup>',
			resolve:{
				user: function($q, $state){
					var defer = $q.defer();
					Meteor.setTimeout(function(){
						var user = Meteor.user();
						if(user){
							console.log('signed in users cannot access sign up page');
							$state.go('profile');
						} else {
							console.log('access granted');
							defer.resolve();
						}
					},500);
					return defer.promise;
				}
			}
		});
};
//window.prerenderReady = true;