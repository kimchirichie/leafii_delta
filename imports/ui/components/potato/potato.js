import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './potato.html';

class Potato {
	constructor($scope, $reactive, $rootScope){
		'ngInject';
		$reactive(this).attach($scope);
		this.rootScope = $rootScope;
		this.editing;
		this.helpers({
			potatoes(){
				return Meteor.users.find({});
			}
		});
		Meteor.subscribe("potato");
	}

	show(id){
		this.editing = id;
	}

	test(){
		console.log(this.rootScope.currentUser);
		console.log(Meteor.user());
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
					},500)
					return defer.promise;
				}
			}
		});
}