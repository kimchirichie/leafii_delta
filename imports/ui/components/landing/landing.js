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
		this.state = $state;
		this.onfilter = 'recent';
		this.horizontal = false;
		this.scope = $scope;
		this.rootScope = $rootScope;
		this.currentUser = Meteor.userId();

		this.rootScope.$watch('search',function(){
			if(this.rootScope.search){
				this.state.go('search');
			}
		}.bind(this));

		angular.element($window).bind("resize", function(){
			if($window.innerWidth < 600){
				angular.element('#gridView').trigger('click');
			}
		});

		this.helpers({
			users(){
				return Meteor.users.find( {"profile.url" : {$exists : true} } );
			}
		});
		
		const handle = Meteor.subscribe("allUsers");

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
