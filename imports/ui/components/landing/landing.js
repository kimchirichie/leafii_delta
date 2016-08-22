import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import template from './landing.html';
import { Views } from '../../../api/views/index';


class Landing {
	constructor($scope, $reactive, $rootScope, $state, $window){
		'ngInject';
		$reactive(this).attach($scope);
		this.scope = $scope;
		this.state = $state;
		this.rootScope = $rootScope;
		this.onfilter = 'recent';
		this.horizontal = false;
		this.currentUser = Meteor.userId();
		this.helpers({
			users(){
				return Meteor.users.find( {"profile.url" : {$exists : true} } );
			}
		});

		angular.element($window).bind("resize", function(){
			if($window.innerWidth < 600){
				this.horizontal = false;
				this.scope.$digest();
			}
		}.bind(this));
		Meteor.subscribe("allUsers");
	}

	liked(user){
		Meteor.call("likeProfile", user._id, user.profile.url);
	}

	viewLog(user){
		var searchKey = 'Browse';
		Meteor.call('addToViews', user._id, searchKey, user.profile.url);
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
