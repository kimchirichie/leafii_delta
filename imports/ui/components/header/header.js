import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Session } from 'meteor/session'
import { Logs } from '../../../api/logs/index';
import hamburger from './hamburger.html';

// import { Accounts } from 'meteor/accounts-base';
import template from './header.html';

class Header {

	constructor($scope, $reactive, $state, $rootScope, $timeout, $mdDialog){
		'ngInject';

		$reactive(this).attach($scope);
		this.state = $state;
		this.mdDialog = $mdDialog;
		this.rootScope = $rootScope;
		this.rootScope.query = "";
		this.rootScope.results = [];
		this.rootScope.searching = false;
    	Meteor.subscribe("logs");
    	this.rootScope.$on("search",function(event,data){
    		this.rootScope.query = data;
    		this.search();
    	}.bind(this))
	}

	search(){
		this.rootScope.results = [];
		this.rootScope.searching = true;
		Fetcher.retrieve("results", "search", this.rootScope.query);
		var user = 'guest';
		if(Meteor.userId()) user = Meteor.userId();
		Logs.insert({type: 'search', createdAt: new Date(), details: {searcher_user_id: user, search_keys: this.rootScope.query}});
		this.state.go('search');
	}

	showMenu(ev) {
		this.mdDialog.show({
	        controller: NavController,
	        controllerAs: 'hamburger',
	        template: hamburger,
	        parent: angular.element(document.body),
	        targetEvent: ev,
	        clickOutsideToClose:true,
	        fullscreen: true,
	        bindToController: true,
	    }).then(function() {
	      console.log('Opened');
	    }, function() {
	      console.log('Closed');
	    });
	}

	logout() {
		this.loggedIn = false;
		Meteor.logout();
		this.gohome();
	}

	gohome(){
		this.query = "";
		this.state.go('landing');
	}
}

function NavController($reactive, $scope, $mdDialog, $rootScope, $state) {
	"ngInject";
	$reactive(this).attach($scope);

	$scope.rootScope = $rootScope;

	$scope.logout = function() {
		Meteor.logout();
		$state.go('landing');
	}; 
	//console.log('inside dialog controller: ', url);
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
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
