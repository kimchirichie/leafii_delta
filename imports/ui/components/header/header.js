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
		this.searched = false;

		$scope.$on('searching', function(event, arg){
			this.searched = true;
			$timeout(function(){angular.element('#searchbar').trigger('focus');}, 0);
		}.bind(this));

		$scope.$on('viewAll', function(event, arg){
			this.searched = true;
		}.bind(this));

	}

	logout() {
		Meteor.logout();
		this.loggedIn = false;
		this.state.go('landing');
	}

	gohome(){
		this.searched = false;
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
