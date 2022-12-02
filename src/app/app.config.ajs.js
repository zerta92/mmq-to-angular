export default function(appModule){
    appModule.config([
        '$locationProvider',
        '$routeProvider',
        '$translateProvider',
        function config($locationProvider, $routeProvider,$translateProvider) {
            $routeProvider
                .when('/', {
                    template: '<index-module></index-module>',
                    reloadOnSearch: false,
                }).otherwise('/');
                // .when('/index', {
                //     template:'<index></index>',
                //     reloadOnSearch: false,
                // })



            $locationProvider.html5Mode({ enabled: true })
            

        },
    ])


}