import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import template from "./leafii.html"

// COMPONENTS
import { name as Navigation } from '../navigation/navigation';
import { name as Landing } from '../landing/landing';
import { name as Signin } from '../signin/signin';
import { name as Signup } from '../signup/signup';
import { name as Welcome } from '../welcome/welcome';



class Leafii{

	constructor($scope, $reactive, $state){
    'ngInject';

    	$reactive(this).attach($scope);

  	}

}

const name = "leafii";

export default angular.module(name,[
	angularMeteor,
	uiRouter,
	ngMaterial,
	Landing,
	Signin,
	Signup,
	Navigation,
	Welcome
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