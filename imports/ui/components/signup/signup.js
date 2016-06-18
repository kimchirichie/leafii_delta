import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';
import template from './signup.html';

class Signup {
  constructor($scope, $reactive, $state, $timeout){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
    this.wait = false;
    this.timeout = $timeout;
  }

  submit(user){

    this.wait = true;
    user.profile.available = true;

    if (this.confirm !== user.password){
      Bert.alert('Your password does not match', 'danger');
      user.password = '';
      this.confirm = '';
      this.timeout(function(){this.wait = false;}.bind(this), 1300);
      return;
    }

    Accounts.createUser(user, function(error){
      if(error) {
        Bert.alert(error.reason, 'danger');
        this.timeout(function(){this.wait = false;}.bind(this), 1300);
      } 
      else {
        Meteor.call('sendVerificationLink', function(error, response){
          
          if(error){
            Bert.alert(error.reason, 'danger');
            this.timeout(function(){this.wait = false;}.bind(this), 1300);
            
          } else {
            user = {};
            this.wait = false;
            this.state.go('welcome');
            Bert.alert('Verification email sent!', 'success');
            Meteor.logout();
          }
        }.bind(this));
      }
    }.bind(this));

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
};