import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import { Meteor } from 'meteor/meteor';
 
import template from './portfolio.html';

class PortfolioPreview {
	constructor($scope, $reactive, $rootScope) {
		'ngInject';

		$reactive(this).attach($scope);
		this.rootScope = $rootScope;
	}
}

const name = 'portfolioPreview';
 
// create a module
export default angular.module(name, [
	angularMeteor,
]).component(name, {
	template,
	controllerAs: name,
	controller: PortfolioPreview
});