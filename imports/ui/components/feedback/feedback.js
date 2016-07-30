import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './feedback.html';

class Feedback {
  constructor($scope, $reactive, $state, $timeout, $rootScope){
    'ngInject';

    $reactive(this).attach($scope);
    this.state = $state;
    this.wait = false;
    this.timeout = $timeout;
  }

  subFeedback(email, comment){
    this.wait = true;
    
    if(email){
      Meteor.call('sendFeedback', email, 'User', 'User Feedback', comment);
    }
    else{
      Meteor.call('sendFeedback', 'support@leafii.com', 'User', 'User Feedback', comment);
    }

    Bert.alert('Feedback Sent', 'success', 'growl-top-right');
    
    email = '';
    comment = '';
    this.timeout(function(){ this.wait=false;}.bind(this), 1000);
    this.timeout(function(){this.state.go('landing');}.bind(this), 1100);
  }

}

const name = 'feedback';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Feedback
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('feedback', {
      url: '/feedback',
      template: '<feedback></feedback>'
    });
}
//window.prerenderReady = true;