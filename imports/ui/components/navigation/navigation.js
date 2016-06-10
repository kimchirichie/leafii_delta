import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Accounts } from 'meteor/accounts-base';
import template from './navigation.html';

class Navigation {

	constructor($scope, $reactive, $state){
		'ngInject';

		$reactive(this).attach($scope);

		this.isLoggedIn();

		$scope.$on('signin', function(event, arg){
			this.isLoggedIn();
		}.bind(this));

	}

	isLoggedIn() {
		if (Meteor.user()){
			this.loggedIn = true;
		} else { 
			this.loggedIn = false;
		}
	}

	logout() {
		Meteor.logout();
		this.loggedIn = false;
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
