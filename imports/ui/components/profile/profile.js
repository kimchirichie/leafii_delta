
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './profile.html';
import frame from '../posts/frame.html';
import frameunsec from '../posts/frameunsec.html';
import { Accounts } from 'meteor/accounts-base';
import { Keywords } from '../../../api/profile/index';
import { Posts } from '../../../api/posts/index';
import { Logs } from '../../../api/logs/index';

import { name as Uploader } from '../uploader/uploader';

class Profile {

	constructor($scope, $reactive, $state, $sce, $timeout, Upload, $rootScope, $stateParams, $mdDialog, $timeout){
		"ngInject";
		$reactive(this).attach($scope);
		this.state = $state;
		this.rootScope = $rootScope;
		this.user_id = $stateParams.user_id || Meteor.userId();
		this.timeout = $timeout;
		this.sce = $sce;
		this.timeo = $timeout;
		this.mdDialog = $mdDialog;
		this.tab = 'edit';
		this.userReady = false;
		this.keywordsReady = false;
		this.postsReady = false;
		this.imgHide = false;
		this.progress = false;
		this.readonly = true;
		this.helpers({
			user(){
				this.userReady = true;
				return Meteor.users.findOne({_id:this.user_id});
			},
			keywords(){
				this.keywordsReady = true;
				return Keywords.find({});
			},
			posts(){
				this.postsReady = true;
				return Posts.find({poster_user_id: this.user_id, deleted: false});
			},
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

		this.subscribe("users");
		this.subscribe('mykeywords');
		this.subscribe('posts');
	}

	loading(){
		return this.userReady && this.keywordsReady && this.postsReady;
	}

	editable(){
		return this.user && this.user._id == Meteor.userId()
	}

	openTab(tab){
		this.tab = tab;
	}

	tabOpen(tab){
		return this.tab == tab;
	}

	update(user){
		var firstName = user.profile.firstName;
		var lastName = user.profile.lastName;
		var occupation = user.profile.occupation;
		var url = user.profile.url;
		var location = user.profile.location.formatted_address || user.profile.location;

		if(!(firstName && lastName && occupation && location)){
			Bert.alert('Profile Error: Please fill in the required fields', 'danger', 'growl-top-right');
			return;
		} 

		Meteor.users.update(this.user_id, {$set: {profile: user.profile}}, {upsert: false, multi:false}, function(error, result){
			if(error){
				Bert.alert(error.reason, 'danger', 'growl-top-right');
			} else {
				Bert.alert('Profile Updated', 'success', 'growl-top-right');
			}
		});
	}

	viewLog(user){	
		var viewer = Meteor.userId() || 'guest';
		Logs.insert({type: 'view', createdAt: new Date(), details: {viewer_user_id: viewer, target_user_id: user._id, type: 'browse', url: user.profile.url}});
		Meteor.call('addToViews',user._id);
	}

	absolutify(url){
		if(url){
			if(url.substring(0,7) == "http://" || url.substring(0,8) == "https://") return this.sce.trustAsResourceUrl(url);
			return this.sce.trustAsResourceUrl('http://' + url.replace(/https:|http:|\/\//gi, ""));
		}
		return "";
	}

	crawl(user_id){
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
				Meteor.call('startCrawl', user_id, function (err, res) {
				  if (err) {
					Bert.alert('Keywords Update Failed', 'danger','growl-top-right');
				  } else {
					Bert.alert('Keywords Updated','success','growl-top-right');
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
		if(url){
			return 'https://' + url.replace(/https:|http:|\/\//gi, "");
		}else{
			return "";	
		}
	}

	showurl(ev, url, name) {
		console.log(this.sce.getTrustedResourceUrl(url).substring(0,8));
		if(this.sce.getTrustedResourceUrl(url).substring(0,8)=="https://") {
			this.mdDialog.show({
		        controller: DialogController,
		        controllerAs: 'frame',
		        template: frame,
		        parent: angular.element(document.body),
		        targetEvent: ev,
		        clickOutsideToClose:true,
		        fullscreen: true,
		        bindToController: true,
		        resolve:{
		      		url: function(){
		      			return url;
		        	},
	            	name: function(){
	              		return name;
	            	}
		        }
		    }).then(function(answer) {
		      // $scope.status = 
		      console.log('You said the information was "' + answer + '".');
		    }, function() {
		      // $scope.status = 'You cancelled the dialog.';
		      console.log('You cancelled the dialog.');
		    });
		}
		else
		{
			this.mdDialog.show({
		        controller: DialogController,
		        controllerAs: 'frameunsec',
		        template: frameunsec,
		        parent: angular.element(document.body),
		        targetEvent: ev,
		        clickOutsideToClose:true,
		        fullscreen: true,
		        bindToController: true,
		        resolve:{
		      		url: function(){
		      			return url;
		        	},
		            name: function(){
		              return name;
		            }
		        }
		    }).then(function(answer) {
		      // $scope.status = 
		      console.log('You said the information was "' + answer + '".');
		    }, function() {
		      // $scope.status = 'You cancelled the dialog.';
		      console.log('You cancelled the dialog.');
		    });
		}
	}

	viewLogPost(post){  
		var viewer = Meteor.userId() || 'guest';
		Logs.insert({type: 'view', createdAt: new Date(), details: {viewer_user_id: viewer, target_user_id: post.poster_user_id, type: 'posts', url: post.url}});
		Meteor.call('addToViews',post.poster_user_id);
	}

	getThumbUrl(id) {
		var user = Meteor.users.find({_id: id}).fetch()[0];
		if(user) return user.profile.thumbnail;
	}

	getMyThumbUrl() {
		if(Meteor.userId()) return Meteor.user().profile.thumbnail;
	}

	trigUpload (files){
		this.timeo(function() {angular.element('.upload').trigger('click');}, 5);
	}
};

function DialogController($reactive, $scope, $mdDialog, url, name) {
	"ngInject";
	$reactive(this).attach($scope);
	//console.log('inside dialog controller: ', url);
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}

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
		url: '/profile/:user_id',
		template: '<profile></profile>'
	});
}
