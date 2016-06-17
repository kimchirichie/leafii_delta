import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './changePassword.html';

class changePassword {
  constructor($scope, $reactive, $state){
    "ngInject";
    $reactive(this).attach($scope);
    this.state = $state;
  }

  updatePass(){

      if(this.password){
        if(this.password != this.confirm){
          Bert.alert('Passwords does not match, please try again', 'danger');
        }
        else {
          Accounts.resetPassword(this.state.params.token, this.password, function(error){
            if(error){
              Bert.alert(error.reason, 'danger');
            }else{
              Bert.alert("You're password has been updated");
            }
          })
          
        }
      }
      else {
          Bert.alert('Please enter a password', 'danger');
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