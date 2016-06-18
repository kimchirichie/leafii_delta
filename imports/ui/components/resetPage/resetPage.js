import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './resetPage.html';

class resetPage {

  constructor($scope, $reactive, $state){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
  }

  forgotPass(email){
    if(email === ''){
      Bert.alert('Please enter your email');
    }
    else {
      Accounts.forgotPassword({email: email}, function(error){
          if(error){
            Bert.alert(error.reason, 'danger');
          }
          else {
            Bert.alert('Email Sent! Please check your email to reset password', 'success');
          }
      });
    }
  }

}

const name = 'resetpage';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: resetPage
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('resetpage', {
      url: '/reset-password',
      template: '<resetpage></resetpage>'
    });
}