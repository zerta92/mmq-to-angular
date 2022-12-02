import 'angular-animate'
import 'angular-route'
import 'angular-material'
import 'ng-meta'
import 'angular-cookies'
import 'angular-loading-bar'
import 'angular-messages'


export default angular.module('mainApp', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMeta',
        // 'pascalprecht.translate',
        'ngCookies',
        'angular-loading-bar',
        'ngMessages',

    ])
    .constant('_', window._)
  
    .filter('trustAsResourceUrl', [
        '$sce',
        function($sce) {
            return function(val) {
                return $sce.trustAsResourceUrl(val)
            }
        },
    ])
    .controller('mainController', [
        '$scope',
        '$cookies',
        '$mdDialog',
        function($scope, $cookies, $mdDialog) {
            console.log(' we liveee')
            $scope.currentyear = new Date().getFullYear()
            $scope.curentDate = new Date()

        },
    ])
