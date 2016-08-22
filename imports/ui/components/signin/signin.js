'use strict';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base'; 
import template from './signin.html';

class Signin {
	constructor($scope, $reactive, $state, $rootScope, $timeout){
		'ngInject';

		$reactive(this).attach($scope);
		this.state = $state;
		this.rootScope = $rootScope;
		this.wait = false;
		this.timeout = $timeout;
		this.rootScope.$broadcast('disableSearch');
	}

	login(email, pass){

		this.wait = true;

		Meteor.loginWithPassword(email, pass, function(error){
			if (error){
				Bert.alert(error.reason, 'danger', 'growl-top-right');
				this.timeout(function(){this.wait = false;}.bind(this), 1300);
			}
			else {
				this.wait = false;
				this.state.go('profile');
			}
		
		}.bind(this));
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
}

const name = 'signin';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
]).component(name, {
	template,
	controllerAs: name,
	controller: Signin
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('signin', {
			url: '/signin',
			template: '<signin></signin>',
			resolve:{
				user: function($q, $state){
					var defer = $q.defer();
					Meteor.setTimeout(function(){
						var user = Meteor.user();
						if(user){
							console.log('signed in users cannot access sign in page');
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
}
//window.prerenderReady = true;