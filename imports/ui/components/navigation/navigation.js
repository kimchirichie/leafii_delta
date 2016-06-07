import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';
import { Accounts } from 'meteor/accounts-base';

class Navigation {

	constructor($scope, $reactive, $state){
	    'ngInject';

	    $reactive(this).attach($scope);
  	}

  	logout() {
  		console.log('logout' + Meteor.user());
  		Meteor.logout();
  		console.log('you are now logged out');
  		console.log('bye' + Meteor.user());
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
