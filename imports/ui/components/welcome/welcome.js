import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './welcome.html';

class Welcome {}

const name = 'welcome';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Welcome
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('welcome', {
      url: '/welcome',
      template: '<welcome></welcome>'
    });
}