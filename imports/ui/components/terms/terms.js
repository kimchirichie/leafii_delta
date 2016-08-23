import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './terms.html';

class Terms {

	constructor($scope, $reactive, $state, $rootScope){
		'ngInject';
		$reactive(this).attach($scope);
	}
}

const name = 'terms';

// create a module
export default angular.module(name, [
	angularMeteor
]).component(name, {
	template,
	controllerAs: name,
	controller: Terms
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('terms', {
      url: '/terms',
      template: '<terms></terms>'
    });
}
//window.prerenderReady = true;
