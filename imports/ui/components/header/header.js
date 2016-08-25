import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Session } from 'meteor/session'
import { Logs } from '../../../api/logs/index';

// import { Accounts } from 'meteor/accounts-base';
import template from './header.html';

class Header {

	constructor($scope, $reactive, $state, $rootScope, $timeout){
		'ngInject';

		$reactive(this).attach($scope);
		this.state = $state;
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

const name = 'header';

// create a module
export default angular.module(name, [
	angularMeteor
]).component(name, {
	template,
	controllerAs: name,
	controller: Header
});
