import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './userBrowse.html';

class userBrowse {
  constuctor($scope, $reactive){
    $reactive(this).attach($scope);
  }
}

const name = 'userbrowse';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: userBrowse
})
  .config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('userbrowse', {
      url: '/profiles',
      template: '<userbrowse></userbrowse>'
    });
}