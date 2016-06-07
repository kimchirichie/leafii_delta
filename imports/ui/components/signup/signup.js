import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Profile } from '/imports/api/auth.js'; 
import template from './signup.html';

class Signup {
  constructor(){
    this.user = {};
  }

  submit(user){

    console.log(user);

    Profile.insert({
       firstName: user.firstName,
       lastName: user.lastName,
       Location: user.location,
       email: user.email,
       password: user.password,
       portUrl: user.url
    });
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