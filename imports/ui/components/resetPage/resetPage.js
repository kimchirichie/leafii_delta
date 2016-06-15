import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './resetPage.html';

class resetPage {

  constructor($scope, $reactive, $state, $rootScope){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
  }

  forgotPass(email){

    Accounts.forgotPassword(email, function(error){
        if(error){
          this.hasError = true;
          this.errorMsg = error.reason;
        }
        else {
          this.hasError = false;
          this.errorMsg = '';
          this.state.go('checkpassword');
        }
    });
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
      url: '/resetPass',
      template: '<resetpage></resetpage>'
    });
}