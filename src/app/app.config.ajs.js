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
                .when('/register', {
                    template: '<signup-module></signup-module>',
                }).otherwise('/');
                // .when('/index', {
                //     template:'<index></index>',
                //     reloadOnSearch: false,
                // })
            $locationProvider.html5Mode({ enabled: true })

        },
    ])


}