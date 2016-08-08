import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import template from './landing.html';

class Landing {
	constructor($scope, $reactive, $rootScope, $state){
		'ngInject';
		$reactive(this).attach($scope);
		this.state = $state;
		this.viewMode = 'grid';
		this.rootScope = $rootScope;
		this.rootScope.$watch('search',function(){
			if(this.rootScope.search){
				this.state.go('search');
				this.rootScope.$broadcast('searching');
			}
		}.bind(this));
		const handle = Meteor.subscribe("allUsers");
		// // needs to wait until the subscription is ready.
		Tracker.autorun(() => {
			if(handle.ready()){
				this.getUsers();
				$scope.$apply();
			}
		});
	}

	getUsers(){
		this.users = Meteor.users.find({}, {sort: {"profile.available": -1, "profile.image": -1}}).fetch();
		this.numOfUsers = this.users.length;
		this.sortUsers();
	}


	sortUsers(){
		var usersInPairs = [];
		var usersInFours = [];

		//Parse out any extra strings
		for(var j = 0; j < this.users.length; j++){
			this.users[j].profile.url = 'http://' +this.users[j].profile.url.replace(/https:|http:|\/\//gi, "");
		}

		//Cuts data in columns of 2
		for (var i = 0; i < this.users.length; i += 2) {
			usersInPairs.push(this.users.slice(i, i + 2));
		}

		//Cuts data in columns of 4
		for (var k = 0; k < usersInPairs.length; k += 2){
			usersInFours.push(usersInPairs.slice(k, k + 2));
		}
		this.usersInFours = usersInFours;
		window.prerenderReady = true;
	}

	absolutify(url){
		return 'http://' + url.replace(/https:|http:|\/\//gi, "");
	}
}

const name = 'landing';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
	utilsPagination
]).component(name, {
	template,
	controllerAs: name,
	controller: Landing
})
.config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider.state('landing', {
		url: '/',
		template: '<landing></landing>'
	});
}
