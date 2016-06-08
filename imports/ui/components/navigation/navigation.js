import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';
import { Accounts } from 'meteor/accounts-base';

class Navigation {

	constructor($scope, $reactive, $state){
		'ngInject';

		$reactive(this).attach($scope);
		var user = Meteor.user()
		console.log(user)
		if (user){
			console.log('in');
			this.rootScope.$broadcast('signin');
		} else { 
			console.log('out');
		}

		$scope.$on('signin', function(event, args){
			this.loggedIn = true;
		}.bind(this));

		$scope.$on('signout', function(event, args){
			this.loggedIn = false;
		}.bind(this));
	}

	logout() {
		console.log('logout' + Meteor.user());
		Meteor.logout();
		this.rootScope.$broadcast('signout');
	}

}



const name = 'navigation';

// create a module
export default angular.module(name, [
	angularMeteor
]).component(name, {
	template,
	controllerAs: name,
	controller: Navigation
});
