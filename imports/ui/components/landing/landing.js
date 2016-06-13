import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import template from './landing.html';

class Landing {
    constuctor($scope, $reactive){
        'ngInject';
        $reactive(this).attach($scope);
        console.log(Meteor.users.find().fetch());
    }

    userLink(link){
        window.open("http://" + link);
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