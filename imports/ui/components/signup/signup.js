'use strict';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base'; 
import template from './signup.html';

class Signup {
  constructor($scope, $reactive, $state){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;

    this.user = {};
  }

  submit(user){

    // console.log("submit: " + JSON.stringify(user));

    if (this.confirm !== user.password){
      alert('Your password does not match');
      user.password = '';
      this.confirm = '';
      return;
    }

    Accounts.createUser(user, ( error ) => {
      if(error) {
        console.log( error.reason);
      } else {
        Meteor.call('sendVerificationLink', ( error, response ) =>{
          if(error){
            console.log(error.reason);
          } else {
            console.log('Verification email sent!', 'success');
            console.log(response);
          }
        });
      }
    });

    // Accounts.onEmailVerificationLink((error)=>{
    //   if(error){
    //     console.log(error.reason);
    //   } else {
    //     console.log("We are verified");
    //   }
    // });


    user = {};
    this.state.go('welcome');
    return;
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
}