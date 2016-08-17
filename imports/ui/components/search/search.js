import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './search.html';

class Search {
	constructor ($scope, $reactive, $rootScope, $state, $window){
		'ngInject';
		$reactive(this).attach($scope);
		this.state = $state;
		this.rootScope = $rootScope;
		this.rootScope.results = [];
		this.rootScope.$watch("search",function(){
			console.log('search initiated');
			Fetcher.retrieve("results", "search", $rootScope.search);
			// $rootScope.results = Fetcher.get("results");
		});
		Meteor.subscribe("allUsers");
	}

	test(){
		console.log(Fetcher.get("results"));
	}

	viewLog(user){
		Meteor.call('addToViews', user._id, this.rootScope.search, user.profile.url);
	}

	liked(user){
		Meteor.call("likeProfile", user._id, user.profile.url);
	}

	absolutify(url){
		return 'http://' + url.replace(/https:|http:|\/\//gi, "");
	}

	secureProtocol(url){
		if(url){
			return 'https://' + url.replace(/https:|http:|\/\//gi, "");
		}else{
			return "";
		}
	}
}

const name = 'search';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
]).component(name, {
	template,
	controllerAs: name,
	controller: Search
})
.config(config);

function config($stateProvider){
	'ngInject';
	$stateProvider.state('search', {
		url: '/search',
		template: '<search></search>'
	});
}
