import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './forgot.html';

class Forgot {

  constructor($scope, $reactive, $state, $timeout){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
    this.wait = false;
    this.timeout = $timeout;
  }

  forgotPass(email){

    this.wait = true;

    Accounts.forgotPassword({email: email}, function(error){

      if(error){
        Bert.alert(error.reason, 'danger', 'growl-top-right');
        this.timeout(function(){this.wait = false;}.bind(this), 1300);
      }
      else {
        Bert.alert('Email Sent! Please check your email to reset password', 'success', 'growl-top-right');
        this.timeout(function(){this.wait = false;}.bind(this), 1300);
        this.email = '';
      }

    }.bind(this));
  }
}

const name = 'forgot';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Forgot
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('forgot', {
      url: '/forgot',
      template: '<forgot></forgot>'
    });
}