import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Session } from 'meteor/session';
import { Logs } from '../../../api/logs/index';

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
				this.rootScope.searching = false;
				return Fetcher.get("results");
			}
		})
		Meteor.subscribe("allUsers");
    	Meteor.subscribe("logs");
	}

	viewLog(user){
		var viewer = 'guest';
		if(Meteor.userId()) viewer = Meteor.userId();
		Logs.insert({type: 'view', createdAt: new Date(), details: {viewer_user_id: viewer, target_user_id: user._id, type: this.rootScope.query, url: user.profile.url}});
		Meteor.call('addToViews',user._id);
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
