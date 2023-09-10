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
                .when('/:language?/procedure-description/:id?', {
                    template: '<procedure-content-module></procedure-content-module>',
                })
                // .when('/list_procedures', {
                //     template: '<list-module></list-module>',
                // })
                .when(
                    '/list_procedures/procedure/:procedure/location/:location/category/:category/country/:country',
                    {
                        template: '<list-module></list-module>',
                        resolve: {
                            title: [
                                '$route',
                                '$http',
                                'GlobalServices',
                                async function($route, $http, GlobalServices) {
                                    console
                                    const params = $route.current.params
                                    let pageTitle = ''
                                    let procedureName = ''
                                    let categoryName = ''
                                    const { procedure, location, category, country } = params

                                    try {
                                        if (procedure && procedure != 'all' && procedure != '0') {
                                            const { data: procedureData } = await $http.get(
                                                '/api/services/getProcedureByProcedureID/' +
                                                    procedure
                                            )
                                            procedureName = procedureData.procedure_Name
                                        }

                                        if (category && category != 'all' && category != '0') {
                                            const {
                                                data: [categoryData],
                                            } = await $http.get(
                                                '/api/categories/categoryById/' + category
                                            )
                                            categoryName = categoryData.category_Name
                                        }

                                        if (procedureName) {
                                            const prefix = await GlobalServices.getTranslation(
                                                'List.TitleDentistsFor'
                                            )
                                            pageTitle = `${prefix} ${procedureName}`
                                            if (
                                                location &&
                                                location != 'undefined' &&
                                                location != 'all'
                                            ) {
                                                pageTitle = `${prefix} ${procedureName} In ${location}`
                                            }
                                        } else if (location != 'undefined' && location != 'all') {
                                            const prefix = await GlobalServices.getTranslation(
                                                'List.TitleDentistsIn'
                                            )

                                            pageTitle = `${prefix} ${location}`
                                        } else if (categoryName) {
                                            pageTitle = `Top ${categoryName} Dentists and Clinics`
                                        } else {
                                            pageTitle = `Top Dentists and Clinics`
                                        }
                                    } catch (err) {
                                        pageTitle = 'Top Dentists and Clinics'
                                    }

                                    return pageTitle
                                },
                            ],
                        },
                    }
                )
                .when('/:language?/service_details', {
                    template: '<list-details-module></list-details-module>',
                    reloadOnSearch: false,
                })
                .when('/:language?/service_details/provider/:providerId/:service?/:procedureId?', {
                    template: '<list-details-module></list-details-module>',
                    reloadOnSearch: false,
                })
                .when('/about-us', {
                    templateUrl: 'app/pages/about_us.template.html',
                })
                .when('/contact_us', {
                    template: '<contact-us-module></contact-us-module>',
                })
                .when('/profile', {
                    //todo: match profile and dashboard routes in redirects and backend paths
                    template: '<profile-module></profile-module>',
                })
                .when('/dashboard', {
                    template: '<dashboard-module></dashboard-module>',
                })
                .otherwise('/')

            $locationProvider.html5Mode({ enabled: true })
        },
    ])
}
