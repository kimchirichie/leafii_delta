'use strict';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base'; 
import template from './signin.html';

class Signin {
  constructor($scope, $reactive, $state, $rootScope){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
    this.rootScope = $rootScope;
    this.hasError = false
    this.errorMsg = '';
  }

  login(email, pass){

    Meteor.loginWithPassword(email, pass, function(error){
      if (error){
        this.hasError = true;
        this.errorMsg = error.reason;
        return;
      }
      else {
        this.hasError = false;
        this.errorMsg = '';
        this.rootScope.$broadcast('signin');
        this.state.go('landing');
        
        return;
      }
      
    }.bind(this));
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