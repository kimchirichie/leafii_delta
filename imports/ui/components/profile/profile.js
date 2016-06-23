
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngFileUpload from 'ng-file-upload';
 
import { Accounts } from 'meteor/accounts-base';
import template from './profile.html';

class Profile {
  constructor($scope, $reactive, $timeout, Upload){
    "ngInject";
    $reactive(this).attach($scope);
    this.getUser();
  }

  getUser(){
    this.user = Meteor.user();
  }

  uploadPic(file) {
    console.log('hehaha');
    Upload.upload({
      url: 'upload/url',
      data: {file:file, '_id': Meteor.userId()}
    }).then(function(resp){
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function(resp){
      console.log('Error status: ' + resp.status);
    }, function(evt){
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  }

  update(user){
    Meteor.users.update(Meteor.userId(), {$set: {profile: user.profile}}, true, false);
    Bert.alert('Profile Updated', 'success');
  }
};

const name = 'profile';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  ngFileUpload
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