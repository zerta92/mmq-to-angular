import 'angular-animate'
import 'angular-route'
import 'angular-material'
import 'ng-meta'
import 'angular-cookies'
import 'angular-loading-bar'
import 'angular-messages'
import 'angular-translate'
import 'angular-translate-loader-static-files'
import 'angular-animate'
import 'angular-route'
import 'ng-intl-tel-input'
import 'angular-recaptcha'

import './core/core.module'
import './core/core.services'
/* Index Component */
import './core/index/index.module'
import './core/index/index.service'
import './index/index.module.ajs'
import './index/index.component'
/* Login Component */
import './core/login/login.module'
import './core/login/login.service'
import './login/login.module'
import './login/login.component'

/* SignupComponent */
// import './core/signup/signup.module'; //Remove once upgraded
// import './core/signup/signup.service';
import './signup/signup.module'
import './signup/signup.component'

/* Global Components */
import './core/components/components.module'
/* Main Dropdown */
import './components/main-dropdown/main_dropdown.module'
import './components/main-dropdown/main_dropdown.component'
/* Services Search Dropdown */
import './components/services-search-dropdown/services_search_dropdown.module'
import './components/services-search-dropdown/services_search_dropdown.component'

export default angular
    .module('mainApp', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMeta',
        'ngIntlTelInput',
        'vcRecaptcha',
        'pascalprecht.translate',
        'core',
        'ngCookies',
        'angular-loading-bar',
        'ngMessages',
        'indexModule',
        'signupModule',
        'loginModule',
        'mainDropdownModule',
        'servicesSearchDropdownModule',
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
    .controller('indexMainController', [
        '$scope',
        'GlobalServices',
        '$translate',
        function($scope, GlobalServices, $translate) {
            $scope.register_and_schedule_consultation_users_url = 'whwghjdfgehwfhwgvewufe'
            $scope.adding_procedures_provider_url = ''
            GlobalServices.getCustomerPreferredLanguage().then(function(lang) {
                if (lang.data != undefined) {
                    $scope.changeLanguage(lang.data)
                }
            })

            $scope.changeLanguage = function(lang) {
                if (lang != undefined) {
                    if (lang.length != 0) {
                        $translate.use(lang)
                        GlobalServices.setCustomerPreferredLanguage(lang)
                            .then(function(lang) {})
                            .catch(angular.noop)
                    }
                }
            }
        },
    ])
