'use strict';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base'; 
import template from './signup.html';

class Signup {
  constructor($scope, $reactive, $state){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
  }

  submit(user){

    user.profile.available = true;

    if (this.confirm !== user.password){
      alert('Your password does not match');
      user.password = '';
      this.confirm = '';
      return;
    }

    Accounts.createUser(user);
    user = {};
    this.state.go('welcome');
    return;
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