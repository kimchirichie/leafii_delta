import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import template from "./leafii.html"

// COMPONENTS
import { name as Landing } from '../landing/landing';
import { name as Signup } from '../signup/signup';
import { name as Navigation } from '../navigation/navigation';

class Leafii{}

const name = "leafii";

export default angular.module(name,[
	angularMeteor,
	uiRouter,
	Landing,
	Signup,
	Navigation,
	ngMaterial
])
.component(name, {
	template,
	controllerAs: name,
	controller: Leafii
})
.config(config);

function config($locationProvider, $urlRouterProvider) {
	'ngInject';
	$locationProvider.html5Mode({'enabled': true, 'requireBase': false});
	$urlRouterProvider.otherwise('/');
}