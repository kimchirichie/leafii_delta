import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';
import loadingBar from 'angular-loading-bar';
import ngFileUpload from 'ng-file-upload';

import template from "./leafii.html"

// COMPONENTS
import { name as Header } from '../header/header';
import { name as Footer } from '../footer/footer';
import { name as Landing } from '../landing/landing';
import { name as Signin } from '../signin/signin';
import { name as Signup } from '../signup/signup';
import { name as Welcome } from '../welcome/welcome';
import { name as Browse } from '../browse/browse';
import { name as Profile } from '../profile/profile';
import { name as Reset } from '../reset/reset';
import { name as Forgot } from '../forgot/forgot';
import { name as Verify } from '../verify/verify';
import { name as Feedback } from '../feedback/feedback';
import { name as Team } from '../team/team';
import { name as About } from '../about/about';
import { name as Search } from '../search/search';
import { name as Term } from '../term/term';


class Leafii{
	constructor($scope, $reactive, $state){
    'ngInject';
    	$reactive(this).attach($scope);
    	 $scope.$on('$viewContentLoaded', function(){
    	 	//window.prerenderReady = true;
  		});
  	}
}

const name = "leafii";

export default angular.module(name,[
	angularMeteor,
	ngAnimate,
	About,
	uiRouter,
	loadingBar,
	ngMaterial,
	ngFileUpload,
	Header,
	Footer,
	Landing,
	Signin,
	Signup,
	Welcome,
	Browse,
	Profile,
	Reset,
	Forgot,
	Verify,
	Feedback,
	Team,
	Welcome,
	Search,
	Term
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
