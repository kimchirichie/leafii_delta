import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './profile.html';

class Profile {
  constuctor($scope, $reactive){
    $reactive(this).attach($scope);
  }

}

const name = 'profile';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Profile
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('profile', {
      url: '/userprofile',
      template: '<profile></profile>'
    });
}