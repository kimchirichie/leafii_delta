import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './changePassword.html';

class changePassword {
  constructor($scope, $reactive, $timeout){
    "ngInject";
    $reactive(this).attach($scope);
  }

  updatePass(user){
    
  }

}

const name = 'changepassword';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: changePassword
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('changepassword', {
      url: '/changepassword',
      template: '<changepassword></changepassword>'
    });
}