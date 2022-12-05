export default function(appModule){
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
                }).otherwise('/');
               
            $locationProvider.html5Mode({ enabled: true })

        },
    ])


}