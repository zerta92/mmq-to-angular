export default function(appModule){
    appModule.config([
        '$locationProvider',
        '$routeProvider',
        function config($locationProvider, $routeProvider) {
            console.log('at router')
            $routeProvider
                .when('/', {
                    template: '<index-module></index-module>',
                    // reloadOnSearch: false,
                }).otherwise('/');
                // .when('/index', {
                //     template:'<index></index>',
                //     reloadOnSearch: false,
                // })



            $locationProvider.html5Mode({ enabled: true })

        },
    ])


}