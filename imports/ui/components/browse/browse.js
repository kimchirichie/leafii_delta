import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './browse.html';

class Browse {
  constructor($scope, $reactive, $rootScope){
    "ngInject";
    $reactive(this).attach($scope);
    this.viewMode = 'grid';
    this.rootScope = $rootScope;
    const handle = Meteor.subscribe("allUsers");
    Tracker.autorun(() => {
      if(handle.ready()){
        this.getUsers();
        $scope.$apply();
      }
    });
  }

  getUsers(){
  //this.users = Meteor.users.find({"profile.available":true}).fetch();
    this.users = Meteor.users.find().fetch();
    this.sortUsers();
    this.rootScope.$broadcast('viewAll');
  }

  sortUsers(){
    var usersInPairs = [];
    var usersInFours = [];

    //Parse out any extra strings
    for(var j = 0; j < this.users.length; j++){
      this.users[j].profile.url = 'http://' +this.users[j].profile.url.replace(/https:|http:|\/\//gi, "");
    }

    //Cuts data in columns of 2
    for (var i = 0; i < this.users.length; i += 2) {
        usersInPairs.push(this.users.slice(i, i + 2));
    }

    //Cuts data in columns of 4
    for (var k = 0; k < usersInPairs.length; k += 2){
        usersInFours.push(usersInPairs.slice(k, k + 2));
    }
    this.usersInFours = usersInFours;
  }
}

const name = 'browse';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
]).component(name, {
  template,
  controllerAs: name,
  controller: Browse
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('browse', {
      url: '/profiles',
      template: '<browse></browse>'
    });
}
