import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './potato.html';

class Potato {
	constructor($scope, $reactive, $state, $timeout, $rootScope){
		'ngInject';
		$reactive(this).attach($scope);
		this.editing;
		this.helpers({
			potatoes(){
				return Meteor.users.find({});
			}
		});
		Meteor.subscribe("potato");
	}

	show(id){
		this.editing = id;
	}
	changeEmail(id){
		users.update({_id: id},{$set: {createdAt: '2016-05-24T23:17:58.674Z'}});
	}

}

const name = 'potato';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
]).component(name, {
	template,
	controllerAs: name,
	controller: Potato
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('potato', {
			url: '/potato',
			template: '<potato></potato>'
		});
}