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

		this.searching = false;

		$scope.$on('searching', function(event, arg){
			this.searching = true;
			$timeout(function(){angular.element('#searchbar').trigger('focus');}, 0);
		}.bind(this));

		$scope.$on('viewAll', function(event, arg){
			this.searching = true;
		}.bind(this));

		$scope.$on('disableSearch', function(event, arg){
			this.searching = false;
			this.rootScope.search = "";
		}.bind(this));

	}

	logout() {
		this.loggedIn = false;
		this.searching = false;
		Meteor.logout();
	}

	gohome(){
		this.searched = false;
		this.searching = false;
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
