import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

var leafiiApp = angular.module('leafii', [
	angularMeteor,
	uiRouter,
	ngMaterial
]);

leafiiApp.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', 
	function($urlRouterProvider, $stateProvider, $locationProvider){

		$locationProvider.html5Mode({'enabled': true, 'requireBase': false});

		$stateProvider 
			.state('landing', {
				url: '/',
				templateUrl: 'client/views/landingPage.html',
			})
			.state('signin',{
				url: '/signin',
				templateUrl: 'client/views/signin.html',
			})
			.state('signup',{
				url: '/signup',
				templateUrl: 'client/views/signup.html',
			})
			.state('thankyou', {
				url: '/thankyou',
				templateUrl: 'client/views/thankyou.html',
			})
			.state('contact', {
				url: '/contact',
				templateUrl: 'client/views/emailer.html',
			})
			.state('feedback', {
				url: '/feedback',
				templateUrl: 'client/views/feedback.html',
			})
			.state('engineer', {
				url: '/engineer',
				templateUrl: 'client/views/engineerPort.html',
			})
			.state('designer', {
				url: '/designer',
				templateUrl: 'client/views/designerPort.html',
			})
			.state('jobs', {
				url: '/jobs',
				templateUrl: 'client/views/jobs.html',
			});

		$urlRouterProvider.otherwise('/');
	}
]);


leafiiApp.controller("mainPage", ['$scope', '$meteor',
	function($scope, $meteor){

		console.log("controller is here");

		$scope.clicked = function(){
			console.log('you clicked');
		};


	}
]);