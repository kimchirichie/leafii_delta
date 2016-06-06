import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './signup.html';

class Signup {
  constructor(){
    this.user = {};
  }

  submit(user){
    console.log(user);
  }
}

const name = 'signup';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Signup
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('signup', {
      url: '/signup',
      template: '<signup></signup>'
    });
}