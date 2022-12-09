export default function(appModule) {
    appModule.config([
        '$locationProvider',
        '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $routeProvider
                .when('/', {
                    template: '<index-module></index-module>',
                    reloadOnSearch: false,
                })
                .when('/index', {
                    template: '<index-module></index-module>',
                    reloadOnSearch: false,
                })
                .when('/register', {
                    template: '<signup-module></signup-module>',
                })
                .when('/login', {
                    template: '<login-module></login-module>',
                })
                .when('/account-verification', {
                    //todo: check backend uses this route
                    template: '<account-verification-module></account-verification-module>',
                })
                .when('/password-reset', {
                    //todo: check backend uses this route
                    template: '<forgot-password-module></forgot-password-module>',
                })
                .when('/what-is-medical-tourism', {
                    templateUrl: 'app/pages/what-is-medical-tourism.template.html',
                    reloadOnSearch: false,
                })
                .when('/pricing', {
                    templateUrl: 'app/pages/pricing.template.html',
                })
                .when('/:language?/procedure-description', {
                    template: '<procedure-content-module></procedure-content-module>',
                })
                .when('/list_procedures', {
                    template: '<list-module></list-module>',
                })
                .when('/:language?/service_details', {
                    template: '<list-details-module></list-details-module>',
                    reloadOnSearch: false,
                })
                .when('/about-us', {
                    templateUrl: 'app/pages/about_us.template.html',
                })
                .when('/contact_us', {
                    templateUrl: 'app/pages/contact_us.template.html',
                })
                .otherwise('/')

            $locationProvider.html5Mode({ enabled: true })
        },
    ])
}
