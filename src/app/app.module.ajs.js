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
import './core/core.services';
/* Index Component */
import './core/index/index.module';
import './core/index/index.service';
import './index/index.module.ajs';
import './index/index.component';

/* SignupComponent */
import './core/signup/signup.module';
import './core/signup/signup.service';
import './signup/signup.module';
import './signup/signup.component';

/* Global Components */
import './core/components/components.module';
/* Main Dropdown */
import './components/main-dropdown/main_dropdown.module'
import  './components/main-dropdown/main_dropdown.component'
/* Services Search Dropdown */
import './components/services-search-dropdown/services_search_dropdown.module'
import  './components/services-search-dropdown/services_search_dropdown.component'

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
        'indexModule',
        'signupModule',
        'mainDropdownModule',
        'servicesSearchDropdownModule'
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
   
