'use strict';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base'; 
import template from './signin.html';

class Signin {
  constructor($scope, $reactive, $state){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
  }

  login(user){
    Meteor.loginWithPassword(user.email, user.pass, function (err) {
      if (err){
        user.error = err;
        console.log('error@@');
        return;
      }
      console.log('success: ' + Meteor.user());
    });
    // this.state.go('landing');
  }
  
  check(){
    console.log(this.error);

  }

}

const name = 'signin';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Signin
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('signin', {
      url: '/signin',
      template: '<signin></signin>'
    });
}