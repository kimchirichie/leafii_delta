import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import { Accounts } from 'meteor/accounts-base';
import template from './profile.html';

class Profile {
  constructor($scope, $reactive, $timeout){
    "ngInject";
    $reactive(this).attach($scope);
    this.updated = false;
    this.timeout = $timeout;
  }

  getUser(){
    this.user = Meteor.user();
  }

  update(user){
    Meteor.users.update(Meteor.userId(), {$set: {profile: user.profile}}, true, false);
    this.updated = true;
    this.timeout(function(){
      this.updated=false;
      angular.element('#updated').addClass("fadeOut");
    }.bind(this), 1800);
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