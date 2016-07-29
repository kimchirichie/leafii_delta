import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './term.html';

class Term {

	constructor($scope, $reactive, $state, $rootScope){
		'ngInject';

		$reactive(this).attach($scope);
	}
}

const name = 'term';

// create a module
export default angular.module(name, [
	angularMeteor
]).component(name, {
	template,
	controllerAs: name,
	controller: Term
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('term', {
      url: '/term',
      template: '<term></term>'
    });
}
//window.prerenderReady = true;
