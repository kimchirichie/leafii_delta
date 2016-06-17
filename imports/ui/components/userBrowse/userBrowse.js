import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './userBrowse.html';

class userBrowse {
  constructor($scope, $reactive){
    "ngInject";
    $reactive(this).attach($scope);
  }

  getUsers(){
    this.users = Meteor.users.find({"profile.available":true}).fetch();
    var usersInPairs = [];

    //Parse out any extra strings
    for(var j = 0; j < this.users.length; j++){
      this.users[j].profile.url = 'http://' +this.users[j].profile.url.replace(/https:|http:|\/\//gi, "");
    }

    //Cuts data in columns of 4
    for (var i = 0; i < this.users.length; i += 4) {
        usersInPairs.push(this.users.slice(i, i + 4));
    }

    this.usersInPairs = usersInPairs;
    
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
}).config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('userbrowse', {
      url: '/profiles',
      template: '<userbrowse></userbrowse>'
    });
}