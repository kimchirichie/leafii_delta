import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { Logs } from '../../../api/logs/index';
import { Posts } from '../../../api/posts/index';

import template from './landing.html';


class Landing {
	constructor($scope, $reactive, $rootScope, $state, $window){
		'ngInject';
		$reactive(this).attach($scope);
		this.scope = $scope;
		this.state = $state;
		this.rootScope = $rootScope;
		this.cardFilter = '-profile.occupation';
		this.helpers({
			users(){
				return Meteor.users.find({"profile.url":{$ne : null}});
			},
			user(){
				return Meteor.users.find({"_id": this.getReactively('latestView[0].details.target_user_id')});
			},
			latestView(){
				return Logs.find({type:"view"});
			},
			lastSearch(){
				return Logs.find({type:"search"});
			},
		});

		console.log(this.users);
		this.subscribe("users");
    	this.subscribe("latest_view");
    	this.subscribe("latest_search");
	}

	liked(user){
		Meteor.call("likeProfile", user._id, user.profile.url);
	}

	viewLog(user){	
		var viewer = Meteor.userId() || 'guest';
		Logs.insert({type: 'view', createdAt: new Date(), details: {viewer_user_id: viewer, target_user_id: user._id, type: 'browse', url: user.profile.url}});
		Meteor.call('addToViews',user._id);
	}

	absolutify(url){
		if(!url) return "";
		return "http://" + url.replace(/https:|http:|\/\//gi, "");
	}

	secureProtocol(url){
		if(!url) return "";
		return 'https://' + url.replace(/https:|http:|\/\//gi, "");
	}

	search(term){
		this.rootScope.$emit("search",term)
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
