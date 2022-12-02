import 'angular-animate'
import 'angular-route'
import 'angular-material'
import 'ng-meta'
import 'angular-cookies'
import 'angular-loading-bar'
import 'angular-messages'
import 'angular-translate'
import 'angular-translate-loader-static-files'
import 'angular-animate';
import 'angular-route';

import './core/core.module';
/* Index Component */
import './core/index/index.module';
import './core/index/index.service';
import './index/index.module.ajs';
import './index/index.component';


export default angular.module('mainApp', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMeta',
        'pascalprecht.translate',
        'core',
        'ngCookies',
        'angular-loading-bar',
        'ngMessages',
        'indexModule'

    ])
    .constant('_', window._)
    // .config([
    //     'cfpLoadingBarProvider',
    //     function(cfpLoadingBarProvider) {
    //         cfpLoadingBarProvider.parentSelector = '#loading-bar-container'
    //         cfpLoadingBarProvider.spinnerTemplate = ''
    //     },
    // ])
    .config([
        '$translateProvider',
        function config($translateProvider) {
            console.log({translate: $translateProvider})
            $translateProvider.preferredLanguage(
                navigator.language == 'es' || navigator.language == 'sp' ? 'sp' : 'en'
            )
            $translateProvider.useSanitizeValueStrategy(null)

            $translateProvider.registerAvailableLanguageKeys(['en', 'sp'], {
                'en-*': 'en',
                'sp-*': 'sp',
            })

            $translateProvider.useStaticFilesLoader({
                prefix: '../app/translation-resources/',
                suffix: '.json',
            })
        },
    ])
    .filter('trustAsResourceUrl', [
        '$sce',
        function($sce) {
            return function(val) {
                return $sce.trustAsResourceUrl(val)
            }
        },
    ])
   
