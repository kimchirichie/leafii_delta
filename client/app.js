import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

if (Meteor.isClient){

	var leafiiApp = angular.module('leafii', [angularMeteor, uiRouter, 'ngRoute']);

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
					});

				$urlRouterProvider.otherwise('/');

	}]);


	leafiiApp.controller("mainPage", ['$scope', '$meteor',
		function($scope, $meteor){

			console.log("controller is here");

			$scope.clicked = function(){
				console.log('you clicked');
			};


		}]);

}






