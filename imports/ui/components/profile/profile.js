
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './profile.html';

import { name as ImageUploader } from '../imageUploader/imageUploader';

class Profile {
  constructor($scope, $reactive, $timeout, Upload, $rootScope){
    "ngInject";
    $reactive(this).attach($scope);
    this.rootScope = $rootScope;
  }

  update(user){
    Meteor.users.update(Meteor.userId(), {$set: {profile: user.profile}}, false, false);
    Bert.alert('Profile Updated', 'success');
  }
};

const name = 'profile';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  ImageUploader
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