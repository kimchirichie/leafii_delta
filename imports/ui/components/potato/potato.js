import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './potato.html';


class Potato {
	constructor($scope, $reactive, $rootScope){
		'ngInject';
		$reactive(this).attach($scope);
		this.rootScope = $rootScope;
		this.showing;
		this.editing;
		this.more;
		this.helpers({
			potatoes(){
				return Meteor.users.find({});
			}
		});
		Meteor.subscribe("potato");
	}

	show(id){
		this.showing = id;
	}

	save(user){
		Meteor.users.update({_id:user._id}, {
			$set: {
				"emails.address":user.emails.address,
				"profile.firstName": user.profile.firstName,
				"profile.lastName": user.profile.lastName,
				"profile.occupation": user.profile.occupation,
				"profile.available": user.profile.available

			}
		});
		this.close();
	}


	close(){
		this.editing = false;
		this.showing = undefined;
	}

	delete(){
		Meteor.users.remove({_id:user._id})

	}

}

const name = 'potato';

export default angular.module(name, [
	angularMeteor,
	uiRouter
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
			template: '<potato></potato>',
			resolve: {
				admin: function ($q) {
					var defer = $q.defer();
					Meteor.setTimeout(function(){
						var user = Meteor.user();
						if(user && user.profile.role == 'admin'){
							defer.resolve()
						} else {
							if(user){
								defer.reject("Only admins can access this page. Access denied");
							} else {
								defer.reject("You must be logged in as admin to access this page. Access denied");
							}
						}
					},1000)
					return defer.promise;
				}
			}
		});
}


