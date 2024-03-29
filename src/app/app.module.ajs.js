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
import 'angular-datatables'
import 'angular-ui-calendar'
import 'angular-moment-picker'

/* Dashboard */
import './core/dashboard/dashboard.module'
import './core/dashboard/dashboard.service'
import './dashboard/dashboard.module'
import './dashboard/dashboard.component'

/* Admin Dashboard */
import './core/admin-dashboard/admin_dashboard.module'
import './core/admin-dashboard/admin_dashboard.service'
import './dashboard/admin-dashboard/admin_dashboard.module'
import './dashboard/admin-dashboard/admin_dashboard.component'

/* Profile */
import './core/profile/profile.module'
import './core/profile/profile.service'
import './profile/profile.module'
import './profile/profile.component'

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
/* Service Manager */
import './core/service_manager/service_manager.module'
import './core/service_manager/service_manager.service'
/* Documents */
import './core/documents/documents.module'
import './core/documents/documents.service'
/* Shopping Cart */
import './core/shopping_cart/shopping_cart.module'
import './core/shopping_cart/shopping_cart.service'
/* Dashboard Menu */
import './components/dashboard_menu/dashboard_menu.module'
import './components/dashboard_menu/dashboard_menu.component'
/* Follow Up*/
import './core/follow_up/follow_up.module'
import './core/follow_up/follow_up.service'
/* Account Verification Component */
import './core/account_verification/account_verification.module'
import './core/account_verification/account_verification.service'
import './account_verification/account_verification.module'
import './account_verification/account_verification.component'
/* Contact Us */
import './core/contact_us/contact_us.module'
import './core/contact_us/contact_us.service'
import './contact_us/contact_us.module'
import './contact_us/contact_us.component'
/* Forgot Password */
import './core/forgot_password/forgot_password.module'
import './core/forgot_password/forgot_password.service'
import './forgot_password/forgot_password.module'
import './forgot_password/forgot_password.component'
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
/* Calendar */
import './components/calendar/calendar.module'
import './components/calendar/calendar.component'

/* Appointment Card */
import './components/appointment_card/appointment_card.module'
import './components/appointment_card/appointment_card.component'
/* Select Datetime */
import './components/select_datetime/select_datetime.module'
import './components/select_datetime/select_datetime.component'
/* Services Search Dropdown */
import './components/services-search-dropdown/services_search_dropdown.module'
import './components/services-search-dropdown/services_search_dropdown.component'
/* Services Selector */
import './components/service_selector/service_selector.module'
import './components/service_selector/service_selector.component'
/* Schedule Appointment Dropdown */
import './components/schedule_appointment/schedule_appointment.module'
import './components/schedule_appointment/schedule_appointment.component'
/* Contact Provider */
import './components/contact_provider/contact_provider.module'
import './components/contact_provider/contact_provider.component'
/* Footer */
import './components/footer/footer.module'
import './components/footer/footer.component'

import * as GlobalEnums from './utils/global_enums'

export default angular
    .module('mainApp', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ui.knob',
        'ngIntlTelInput',
        'vcRecaptcha',
        'pascalprecht.translate',
        'datatables',
        'ui.calendar',
        'core',
        'ngCookies',
        'ngMap',
        'ngMeta',
        'angular-loading-bar',
        'ngMessages',
        'indexModule',
        'signupModule',
        'loginModule',
        'mainDropdownModule',
        'calendarModule',
        'serviceSelectorModule',
        'appointmentCardModule',
        'procedureContentModule',
        'dashboardMenuModule',
        'servicesSearchDropdownModule',
        'listModule',
        'listDetailsModule',
        'accountVerificationModule',
        'contactUsModule',
        'forgotPasswordModule',
        'scheduleAppointmentModule',
        'selectDatetimeModule',
        'contactProviderModule',
        'footerModule',
        'profileModule',
        'dashboardModule',
        'adminDashboardModule',
        'dashboardMenuModule',
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
        '$rootScope',
        function(ngMeta, $location, $rootScope) {
            // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            // if (timezone == 'America/Guayaquil' && $location.url() !== '/page_down') {
            //     location.href = '/page_down'
            //     return
            // }
            ngMeta.init()
            $rootScope.$on('$routeChangeStart', async function(event, next, current) {
                // trackingManager.trackCustomerAction({
                //     action: 'page_view',
                //     url: $location.absUrl(),
                //     agent: window.navigator.userAgent,
                // })
                $rootScope.show_find_procedures_bubble = ![
                    '/list_procedures',
                    '/service_details',
                ].find(url => {
                    return $location.url().includes(url)
                })
            })
        },
    ])
    .run([
        '$rootScope',
        '$location',
        '$cookies',
        'GlobalServices',
        function($rootScope, $location, $cookies, GlobalServices) {
            const adminRoutes = [
                '/categoryUpload',
                '/listCategories',
                '/includes',
                '/listIncludes',
                '/procedures',
                '/listProcedures',
                '/adminOptions',
                '/listAdminOptions',
                '/bulkProceduresUpload',
                '/customerSupport',
                '/providerInvoices',
                '/brands',
            ]
            const commonRoutes = [
                '/adminMedquest:',
                '/dashboard',
                '/dashboard:load_demo',
                '/profile',
                '/medquestMyPlaces',
                '/shoppingCart',
                '/medquestDocuments',
                '/listDocuments',
            ]
            const userRoutes = [
                '/userMessages',
                '/userServicesManager',
                '/user',
                '/user/:userId',
                '/listUsers',
            ]
            const providerRoutes = [
                '/messages',
                '/openMessage',
                '/providerServicesManager',
                '/adminServices',
                '/provider',
                '/staff',
                '/inviteStaff',
                '/listStaff',
                '/listProvider',
            ]

            const allRoutes = [...providerRoutes, ...adminRoutes, ...userRoutes, ...commonRoutes]
            $rootScope.$on('$locationChangeStart', function(event) {
                if (allRoutes.includes($location.url())) {
                    $rootScope.showDashboardMenu = true
                } else {
                    $rootScope.showDashboardMenu = false
                }
            })

            var getRoutePermissions = function(route) {
                const need_admin_permission = adminRoutes.find(function(noAuthRoute) {
                    return noAuthRoute.includes(route)
                })
                if (need_admin_permission) {
                    return GlobalEnums.AccountType.Admin
                }
                const need_provider_permission = providerRoutes.find(function(noAuthRoute) {
                    return noAuthRoute.includes(route)
                })
                if (need_provider_permission) {
                    return GlobalEnums.AccountType.Provider
                }
                const need_user_permission = userRoutes.find(function(noAuthRoute) {
                    return noAuthRoute.includes(route)
                })
                if (need_user_permission) {
                    return GlobalEnums.AccountType.User
                }

                return 'Any'
            }

            $rootScope.$on('$routeChangeStart', async function(event, next, current) {
                const cookie = $cookies.getObject('MyMedQuestC00Ki3')
                if (!cookie && allRoutes.includes($location.url())) {
                    location.href = '/login'
                }
                const userData = await GlobalServices.getUserProfile(cookie?.token)
                if (
                    !userData &&
                    !userData.data &&
                    !userData.data.profileType &&
                    allRoutes.includes($location.url())
                ) {
                    location.href = '/login'
                }
                const profileType = userData.data.profileType
                if (profileType === 'Admin') {
                    return
                }
                const requiredPermission = getRoutePermissions($location.url())
                if (requiredPermission === 'Any') {
                    return
                }
                if (requiredPermission !== profileType && allRoutes.includes($location.url())) {
                    location.href = 'dashboard'
                }
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
        '$rootScope',
        'GlobalServices',
        'DashboardServices',
        '$translate',
        '$cookies',
        async function(
            $scope,
            $rootScope,
            GlobalServices,
            DashboardServices,
            $translate,
            $cookies
        ) {
            $scope.user = {}
            $scope.priviliges = {}

            $scope.main_controller_user_loaded = false
            await getUser()

            $scope.main_controller_user_loaded = true

            $scope.messages = []
            $scope.upcoming_appointment = false
            $scope.nearest_appointment_id = null
            $scope.show_payment_notification = false

            $scope.notificationOfConsultationLabels = []
            $scope.notificationOfConsultationData = []
            $scope.servicesForAcceptingData = []
            $scope.servicesForAcceptingLabels = []
            $scope.acceptedServicesData = []
            $scope.acceptedServicesLabels = []

            $scope.userMenu = []
            $scope.infoBannerMenu = []

            $scope.is_appointment_time = false

            $scope.register_and_schedule_consultation_users_url = ''
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
                            .then(function(lang) {
                                loadYoutubeVideos()
                            })
                            .catch(angular.noop)
                    }
                }
            }

            async function getUser() {
                const userData = await GlobalServices.getUserProfile(
                    $cookies.getObject('MyMedQuestC00Ki3') &&
                        $cookies.getObject('MyMedQuestC00Ki3').token
                )

                try {
                    if (userData.data.username) {
                        $scope.user = userData.data
                        $scope.user.loggedIn = true
                    } else {
                        $scope.user.loggedIn = false
                    }
                    $rootScope.user = $scope.user
                } catch (err) {
                    $scope.user.loggedIn = false
                    $rootScope.user = $scope.user
                }
            }

            setTimeout(() => {
                refreshProfile()
            }, 500)

            setInterval(async function() {
                refreshProfile()
            }, 60000)

            async function refreshProfile() {
                let upcoming_appointment
                if ($scope.user.profileType === GlobalEnums.AccountType.User) {
                    upcoming_appointment = await getNearestAppointmentNotification('user')
                } else {
                    upcoming_appointment = await getNearestAppointmentNotification('provider')
                }

                $scope.upcoming_appointment = upcoming_appointment
                if (!upcoming_appointment) {
                    return
                }

                const {
                    appointment_Date,
                    days,
                    hours,
                    minutes,
                    count,
                    appointment_id,
                } = upcoming_appointment
                const is_appointment_time = isAppointmentTime(appointment_Date)

                setAppointmentReminderBanner(
                    appointment_id,
                    Math.round(days),
                    Math.round(hours),
                    Math.round(minutes),
                    count
                )

                if (is_appointment_time) {
                    if ($scope.user.profileType === GlobalEnums.AccountType.Provider) {
                        $rootScope.$emit('meeting-time', appointment_id)
                    }
                    const active_room_appointment_data = await checkCurrentAppointmentRoom(
                        upcoming_appointment
                    )

                    if (!active_room_appointment_data) {
                        $rootScope.$emit('meeting-ended', appointment_id)
                        return
                    }
                    $rootScope.$emit('meeting-started', active_room_appointment_data)
                }
            }

            function isAppointmentTime(appointment_Date) {
                const appointment_date_plus_an_hour = moment(appointment_Date).add(60, 'minutes')

                if (
                    moment().isAfter(appointment_Date) &&
                    moment().isBefore(appointment_date_plus_an_hour)
                ) {
                    $scope.is_appointment_time = true
                    return true
                }
                $scope.is_appointment_time = false
                return false
            }

            async function checkCurrentAppointmentRoom(upcoming_appointment) {
                const appointment_room_data = {
                    appointment_Type: upcoming_appointment.appointment_Type,
                    provider_ID: upcoming_appointment.provider_ID,
                    user_ID: upcoming_appointment.user_ID,
                    service_ID: upcoming_appointment.service_ID,
                    appointment_ID: upcoming_appointment.appointment_ID,
                }
                const active_room = await GlobalServices.checkCurrentAppointmentRoom(
                    appointment_room_data
                )
                const { match, match_active_room } = active_room.data

                if (match) {
                    return appointment_room_data
                }
                return
            }

            async function getNearestAppointmentNotification(type) {
                var count = 0
                const differenceData = await GlobalServices.getUserAppointmentsDiff(
                    $scope.user.ID,
                    type
                )

                if (!differenceData.data.length) {
                    return
                }

                const appointments_date_difference = differenceData.data

                const nearest_appointment = appointments_date_difference.find(appointment => {
                    return (
                        appointment.day_difference >= 0 &&
                        appointment.hour_difference >= 0 &&
                        appointment.minute_difference >= -60
                    )
                })

                if (!nearest_appointment) {
                    return
                }

                const {
                    appointment_ID: appointment_id,
                    appointment_Paid,
                    appointment_Status,
                    appointment_ID,
                    appointment_Type,
                    user_ID,
                    service_ID,
                    provider_ID,
                } = nearest_appointment
                $scope.nearest_appointment_id = appointment_id
                $scope.show_payment_notification = !appointment_Paid && appointment_Status

                var minute_difference = moment.duration(
                    moment(nearest_appointment.appointment_Date.toLocaleString()).diff(moment())
                )

                const days_ = minute_difference.asMinutes() / (60 * 24)
                const hours_ = (days_ % 1) * 24
                const minutes_ = (hours_ % 1) * 60

                const days = days_ > 1 ? days_ : 0
                const hours = hours_ > 1 ? hours_ : 0
                const minutes = minutes_ > 1 ? minutes_ : 0
                if (differenceData.data.length != 0) {
                    appointments_date_difference.forEach(function(objDiff) {
                        if (objDiff.day_difference > 5) {
                            const haveAppointmentsAlert = true
                        } else {
                            count += 1
                        }
                    })
                }

                return {
                    appointment_id,
                    days,
                    hours,
                    minutes,
                    count,
                    appointment_Date: nearest_appointment.appointment_Date,
                    appointment_ID,
                    appointment_Type,
                    user_ID,
                    service_ID,
                    provider_ID,
                }
            }

            async function setAppointmentReminderBanner(
                appointment_id,
                days,
                hours,
                minutes,
                appointment_count
            ) {
                if ($scope.is_appointment_time) {
                    $scope.go_to_appointment_text = await $translate(
                        'Dashboard.goToAppointment'
                    ).catch(err => msg)
                } else {
                    if (days >= 0 && hours >= 0 && minutes > 0) {
                        let appointment_in = await $translate('Dashboard.appointmentIn').catch(
                            err => msg
                        )
                        $scope.appointment_in = appointment_in
                            .replace('*days', days)
                            .replace('*hours', hours)
                            .replace('*minutes', minutes)

                        const count_limit = appointment_count > 9 ? '9_plus' : appointment_count
                    }
                }
            }

            $scope.HideNotificationFloat = function(id) {
                angular.element(`#${id}`)[0].style.display = 'none'
            }
        },
    ])
