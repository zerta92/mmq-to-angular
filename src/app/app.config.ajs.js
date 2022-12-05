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
                .when('/what-is-medical-tourism', {
                    templateUrl: 'app/pages/what-is-medical-tourism.template.html',
                    reloadOnSearch: false,
                })
                .when('/:language?/procedure-description', {
                    template: '<procedure-content-module></procedure-content-module>',
                })
                .when('/list_procedures', {
                    template: '<list-module></list-module>',
                })
                .otherwise('/')

            $locationProvider.html5Mode({ enabled: true })
        },
    ])
}
