import angular from 'angular';
import angularMeteor from 'angular-meteor';

// import { Accounts } from 'meteor/accounts-base';
import template from './header.html';

class Header {

	constructor($scope, $reactive, $state, $rootScope, $timeout){
		'ngInject';

		$reactive(this).attach($scope);
		this.state = $state;
		this.rootScope = $rootScope;
		this.searching = true;
		this.query = undefined;
	}

	search(){
		console.log('requesting search');
		this.rootScope.search = this.query;
	}

	logout() {
		this.loggedIn = false;
		Meteor.logout();
		this.gohome();
	}

	gohome(){
		this.rootScope.search = "";
		this.state.go('landing');
	}
}



const name = 'header';

// create a module
export default angular.module(name, [
	angularMeteor
]).component(name, {
	template,
	controllerAs: name,
	controller: Header
});
