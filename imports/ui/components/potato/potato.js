import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './potato.html';


class Potato {
	constructor($scope, $reactive, $rootScope){
		'ngInject';
		$reactive(this).attach($scope);
		this.rootScope = $rootScope;
		this.showing;
		this.editing;
		this.helpers({
			users(){
				return Meteor.users.find({});
			}
		});
		Meteor.subscribe("potato");
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
		Meteor.users.update({_id:user._id}, {
			$set: {
				"profile.url":user.profile.url,
				"profile.firstName": user.profile.firstName,
				"profile.lastName": user.profile.lastName,
				"emails[0].address":user.emails[0].address,
				"profile.occupation": user.profile.occupation,
				"profile.available": user.profile.available

			}
		});
		user.editing = false;
	}

	delete(user){
		Meteor.users.remove(user._id);
	}

}

const name = 'potato';

export default angular.module(name, [
	angularMeteor,
	uiRouter
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
						if(user && user.profile.role == 'admin'){
							console.log('access granted');
							defer.resolve()
						} else {
							if(user){
								console.log(user);
								console.log('user not admin');
								defer.reject("Only admins can access this page. Access denied");
							} else {
								console.log('user not found');
								defer.reject("You must be logged in as admin to access this page. Access denied");
							}
						}
					},1000)
					return defer.promise;
				}
			}
		});
}


