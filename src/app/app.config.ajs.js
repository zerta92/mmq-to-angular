export default function(appModule){
    appModule.config([
        '$locationProvider',
        '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $routeProvider
                .when('/', {
                    template: '/app/app.html',
                    controller: 'indexMainController',
                    reloadOnSearch: false,
                })
                .when('/index', {
                    templateUrl: './app.html',
                    controller: 'indexMainController',
                    reloadOnSearch: false,
                })
                .when('/about_us', {
                    templateUrl: 'about-us.html',
                    controller: 'indexMainController',
                })
                .when('/featured', {
                    templateUrl: 'our-dental-procedures.html',
                    controller: 'indexMainController',
                })
                .when('/how_it_works', {
                    templateUrl: 'howItWorks.html',
                    controller: 'indexMainController',
                })
                .when('/contact_us', {
                    templateUrl: 'contact-us.html',
                    controller: 'indexMainController',
                })
                .when('/what_we_do', {
                    templateUrl: 'what-we-do.html',
                    controller: 'indexMainController',
                })
                .when('/featured2', {
                    templateUrl: 'featured.html',
                    controller: 'indexMainController',
                })
                .when('/pricing', {
                    templateUrl: 'price.html',
                    controller: 'indexMainController',
                })
                .when('/register', {
                    templateUrl: 'signup.html',
                    controller: 'signupMainController',
                })
                .when('/account_verification', {
                    templateUrl: 'account-confirmation.html',
                    controller: 'signupMainController',
                })
                .when('/password_reset', {
                    templateUrl: 'forgot-pass.html',
                    controller: 'signupMainController',
                })
                .when('/login', {
                    templateUrl: 'login.html',
                    controller: 'loginMainController',
                })
                .when('/:language?/procedure-description', {
                    templateUrl: 'procedure-content.html',
                    controller: 'procedureContentMainController',
                })
                .when('/list_procedures', {
                    templateUrl: 'list.html',
                    controller: 'listMainController',
                })
                .when('/:language?/service_details', {
                    templateUrl: 'listingDetails.html',
                    controller: 'listingDetailsMainController',
                    reloadOnSearch: false,
                })
                .when('/what-is-medical-tourism', {
                    templateUrl: 'pages/what-is-medical-tourism.html',
                    reloadOnSearch: false,
                })
                .when('/page_down', {
                    templateUrl: 'page_down.html',
                })
                .otherwise({
                    redirectTo: '/index',
                })

            $locationProvider.html5Mode({ enabled: true })

        },
    ])


}