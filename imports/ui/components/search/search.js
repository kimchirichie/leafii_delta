import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Session } from 'meteor/session';

import template from './search.html';

class Search {
	constructor ($scope, $reactive, $rootScope, $state, $window){
		'ngInject';
		$reactive(this).attach($scope);
		this.state = $state;
		this.scope = $scope;
		this.rootScope = $rootScope;
		this.helpers({
			results(){
				return Fetcher.get("results");
			}
		})
		Meteor.subscribe("allUsers");
	}

	viewLog(user){
		Meteor.call('addToViews', user._id, this.rootScope.query, user.profile.url);
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
