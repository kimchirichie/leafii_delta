import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './landing.html';

class Landing {
    constuctor($scope, $reactive){
        'ngInject';

        $reactive(this).attach($scope);
    }
    getUsers(){
        console.log("users loaded");
        this.users = Meteor.users.find().fetch();
        console.log(this.users);
    }
}

const name = 'landing';

export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: Landing
})
.config(config);
 
function config($stateProvider) {
    'ngInject';
    $stateProvider.state('landing', {
        url: '/',
        template: '<landing></landing>'
    });
}