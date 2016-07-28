
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './profile.html';
import { Accounts } from 'meteor/accounts-base';
import { Keywords } from '../../../api/profile/index';

import { name as Image } from '../image/image';

class Profile {

	constructor($scope, $reactive, $timeout, Upload, $rootScope){
		"ngInject";
		$reactive(this).attach($scope);
		this.rootScope = $rootScope;
		this.timeout = $timeout;
		this.imgHide = false;
		this.progress = false;
		this.readonly = true;
		this.subscribe('mykeywords');
		this.helpers({
			keywords(){
				return Keywords.find({});
			}
		});

		//Hide profile pic while editing
		$scope.$on('editImg', function(event, arg){
			this.progress = true;
			this.imgHide = true;
			this.timeout(function(){this.progress = false;}.bind(this), 1200);
		}.bind(this));

		//Show profile pic when editing is done
		$scope.$on('editDone', function(event, arg){
			this.imgHide = false;
		}.bind(this));
	}

	update(user){
		console.log('update');
		Meteor.users.update(Meteor.userId(), {$set: {profile: user.profile}}, false, false);
		Bert.alert('Profile Updated', 'success');
	}

	delete(keyword) {
		Keywords.remove(keyword._id);
	}

	insert(){
		data = {
			url: this.rootScope.currentUser.profile.url, 
			type: "self",
			user_id: this.rootScope.currentUser._id, 
			keyword: this.newkeyword
		};
		Keywords.insert(data);
		this.newkeyword = undefined;
	}
};

const name = 'profile';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
	Image
]).component(name, {
	template,
	controllerAs: name,
	controller: Profile
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider
		.state('profile', {
			url: '/profile',
			template: '<profile></profile>'
		});
}