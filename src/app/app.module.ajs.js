import 'angular-animate'
import 'angular-route'
import 'angular-material'
import 'ng-meta'
import 'angular-cookies'
import 'angular-loading-bar'
import 'angular-messages'

import 'angular-animate';
import 'angular-route';

import './core/core.module';
import './core/index/index.module';
import './index/index.module.ajs';
import './index/index.component';

console.log('fuck')

export default angular.module('mainApp', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMeta',
        // 'pascalprecht.translate',
        'core',
        'ngCookies',
        'angular-loading-bar',
        'ngMessages',
        'indexModule'

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
   
