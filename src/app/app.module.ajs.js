import 'angular-animate'
import 'angular-route'
import 'angular-material'
import 'ng-meta'
import 'ngmap'
import 'ng-ui-knob'
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
/* Procedure Content Component */
import './core/procedure_content/procedure_content.module'
import './core/procedure_content/procedure_content.service'
import './procedure_content/procedure_content.module'
import './procedure_content/procedure_content.component'
/* List Component */
import './core/list/list.module'
import './core/list/list.service'
import './list/list.module'
import './list/list.component'
/* List Details Component */
import './core/list_details/list_details.module'
import './list_details/list_details.module'
import './list_details/list_details.component'
/* Service Component */
import './core/service/service.module'
import './core/service/service.service'
/* Service Component */
import './core/app/brand/brand.module'
import './core/app/brand/brand.service'

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
/* Schedule Appointment Dropdown */
import './components/schedule_appointment/schedule_appointment.module'
import './components/schedule_appointment/schedule_appointment.component'

export default angular
    .module('mainApp', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMeta',
        'ui.knob',
        'ngIntlTelInput',
        'vcRecaptcha',
        'pascalprecht.translate',
        'core',
        'ngCookies',
        'ngMap',
        'angular-loading-bar',
        'ngMessages',
        'indexModule',
        'signupModule',
        'loginModule',
        'mainDropdownModule',
        'procedureContentModule',
        'servicesSearchDropdownModule',
        'listModule',
        'listDetailsModule',
        'scheduleAppointmentModule',
    ])
    .constant('_', window._)
    .config([
        'cfpLoadingBarProvider',
        function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.parentSelector = '#loading-bar-container'
            cfpLoadingBarProvider.spinnerTemplate = ''
        },
    ])
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
    .run([
        'ngMeta',
        '$location',
        function(ngMeta, $location) {
            // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            // if (timezone == 'America/Guayaquil' && $location.url() !== '/page_down') {
            //     location.href = '/page_down'
            //     return
            // }
            ngMeta.init()
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
