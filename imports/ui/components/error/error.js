import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './error.html';

class Error {
		constructor($scope, $reactive, $state){
		'ngInject';
		$reactive(this).attach($scope);
		this.state = $state;

	}
}

const name = 'error';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
]).component(name, {
	template,
	controllerAs: name,
	controller: Error
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('error', {
			url: '/error',
			template: '<error></error>',
			params:{
				reason: "you shouldn't come to the error page, not expecting an error"
			}
		});
}
//window.prerenderReady = true;