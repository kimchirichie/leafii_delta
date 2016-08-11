
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './profile.html';
import { Accounts } from 'meteor/accounts-base';
import { Keywords } from '../../../api/profile/index';
import { Views } from '../../../api/views/index';

import { name as Uploader } from '../uploader/uploader';

class Profile {

	constructor($scope, $reactive, $state, $timeout, Upload, $rootScope){
		"ngInject";
		$reactive(this).attach($scope);
		this.rootScope = $rootScope;
		this.state = $state;
		this.timeout = $timeout;
		this.imgHide = false;
		this.progress = false;
		this.readonly = true;
	    this.showPass = false;
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

		//Update the user's profile when they leave the page
		$scope.$on("$destroy", function(){
			this.update(this.rootScope.currentUser);
		}.bind(this));

	}

	passBack() {
		this.showPass = false;
		this.oldPass = undefined;
		this.confirm = undefined;
		this.newPass = undefined;
	}

	update(user){
		Meteor.users.update(Meteor.userId(), {$set: {profile: user.profile}}, false, false);
		Bert.alert('Profile Updated', 'success', 'growl-top-right');
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

	crawl(){
		confirmed = swal({
  			title: "Are you sure?",
  			text: "It will delete all the previous keywords & re-parse your website.",
  			type: "warning",
  			// #DD6B55
  			showCancelButton: true,
  			confirmButtonColor: "#3edeaa",
 			confirmButtonText: "Yes, re-parse it!",
  			closeOnConfirm: true
			},function(){
				Meteor.call('startCrawl', function (err, res) {
				  if (err) {
				    Bert.alert('Keywords Update Failed', 'danger');
				  } else {
				    Bert.alert('Keywords Updated','success')
				  }
				});
			})
	}

	changePassword(){
		if(this.newPass != this.confirm){
	        Bert.alert('Password does not match!', 'danger', 'growl-top-right');
	        return;
		}

		Accounts.changePassword(this.oldPass, this.newPass, function(error){
			if(error){
				Bert.alert(error.reason, 'danger', 'growl-top-right');
				this.timeout(function(){this.wait = false;}.bind(this), 1300);
			} else {
				Bert.alert('Password has been updated!', 'success', 'growl-top-right');
				this.oldPass = undefined;
				this.newPass = undefined;
				this.confirm = undefined;
				this.timeout(function(){this.wait = false;}.bind(this), 1300);
				this.email = '';
			}
	    }.bind(this));
	}

	verify(){
		Meteor.call('sendVerificationLink', function(error, response){				
			if(error){
				Bert.alert(error.reason, 'danger', 'growl-top-right');
			} else {
				Bert.alert('Verification email sent!', 'success', 'growl-top-right');
			}
		}.bind(this));
	}

	secureProtocol(url){
			if(url)
				return 'https://' + url.replace(/https:|http:|\/\//gi, "");
			else
				return "";
	}
};

const name = 'profile';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
	'google.places',
	Uploader
]).component(name, {
	template,
	controllerAs: name,
	controller: Profile
}).config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider.state('profile', {
        url: '/profile',
        template: '<profile></profile>'
	});
}
