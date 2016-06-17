import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './verifyEmail.html';

class Verification {
  constructor($scope, $reactive, $state){
    'ngInject';
    $reactive(this).attach($scope);
    this.state = $state;
    this.verify();
  }

  verify(){
    Accounts.verifyEmail(this.state.params.token, function(error){
      if(error){
        Bert.alert(error.reason, 'danger');
      }
      else{
        Bert.alert('Your email has been verified!', 'success');
        this.state.go('signin');
      }
    }.bind(this));
  }



}

const name = 'verification';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Verification
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('verification', {
      url: '/verify-email/:token',
      template: '<verification></verification>'
    });
}