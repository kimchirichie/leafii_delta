import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './changePassword.html';

class changePassword {
  constructor($scope, $reactive, $state, $timeout){
    "ngInject";
    $reactive(this).attach($scope);
    this.state = $state;
    this.timeout = $timeout;
    this.wait = false;
  }

  updatePass(){

    this.wait = true;

    if(this.password != this.confirm){
      Bert.alert('Passwords does not match, please try again', 'danger');
      this.password = '';
      this.confirm = '';
      this.timeout(function(){this.wait = false;}.bind(this), 1300);
    }
    else {

      Accounts.resetPassword(this.state.params.token, this.password, function(error){
        if(error){
          Bert.alert(error.reason, 'danger');
          this.password = '';
          this.confirm = '';
          this.timeout(function(){this.wait = false;}.bind(this), 1300);
        }else{
          Bert.alert("You're password has been updated", 'success');
          this.wait = false;
          this.password = '';
          this.confirm = '';

          this.state.go('signin');

        }
      }.bind(this));
    }
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
      url: '/reset-password/:token',
      template: '<changepassword></changepassword>'
    });
}
window.prerenderReady = true;