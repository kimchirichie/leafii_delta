import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './signin.html';

//Functions & Controller
class Signin {}


//Export controller and html
const name = 'signin';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Signin
}).config(config);
 
//Make html into a directive
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('signin', {
      url: '/signin',
      template: '<signin></signin>'
    });
}