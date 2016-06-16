import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

class ConfirmEmail {
  constructor($scope, $reactive, $state){
    "ngInject";

    $reactive(this).attach($scope);
    this.state = $state;
    this.verify();
    console.log("you are in the controller");
 
  }

  verify(){

    console.log("verifying Email");
  	Accounts.verifyEmail(this.params.token, function(error){
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

console.log('this loaded');

const name = 'confirmemail';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  controllerAs: name,
  controller: ConfirmEmail
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('confirmEmail', {
      url: '/verify-email/:token'
    });
};