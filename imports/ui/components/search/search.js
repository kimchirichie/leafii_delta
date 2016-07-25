import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './search.html';
import { Keywords } from '../../../api/keywords/index';

class Search {
	constructor ($scope, $reactive, $rootScope, $state){
		'ngInject';
		$reactive(this).attach($scope);
		this.results = [];
		this.state = $state;
		this.rootScope = $rootScope;
		this.subscribe('keywords', () => [this.getReactively('rootScope.search')]);
		this.helpers({
			results(){
				return Keywords.find({}, {
					sort : this.getReactively('sort')
				}).map(function(keyword){
					return keyword.user_id;
				}).filter(function(item, pos, self) {
					return self.indexOf(item) == pos;
				});
			},
			keywordsCount() {
				return Counts.get('numberOfKeywords');
			},
			websites(){
				return Meteor.users.find({
					_id: { $in: this.getReactively('results')}
				})
			}
		});
		Meteor.subscribe("allUsers");
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