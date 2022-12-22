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

/* Dashboard */
import './core/dashboard/dashboard.module'
import './core/dashboard/dashboard.service'
import './dashboard/dashboard.module'
import './dashboard/dashboard.component'

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
/* Services Search Dropdown */
import './components/services-search-dropdown/services_search_dropdown.module'
import './components/services-search-dropdown/services_search_dropdown.component'
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
        'ngMeta',
        'ui.knob',
        'ngIntlTelInput',
        'vcRecaptcha',
        'pascalprecht.translate',
        'datatables',
        'ui.calendar',
        'core',
        'ngCookies',
        'ngMap',
        'angular-loading-bar',
        'ngMessages',
        'indexModule',
        'signupModule',
        'loginModule',
        'mainDropdownModule',
        'calendarModule',
        'appointmentCardModule',
        'procedureContentModule',
        'servicesSearchDropdownModule',
        'listModule',
        'listDetailsModule',
        'accountVerificationModule',
        'contactUsModule',
        'forgotPasswordModule',
        'scheduleAppointmentModule',
        'contactProviderModule',
        'footerModule',
        'profileModule',
        'dashboardModule',
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
        '$rootScope',
        'GlobalServices',
        '$translate',
        '$cookies',
        async function($scope, $rootScope, GlobalServices, $translate, $cookies) {
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
                            .then(function(lang) {})
                            .catch(angular.noop)
                    }
                }
            }

            function getMenu(profile_id) {
                GlobalServices.getUserMenu(profile_id).then(function(menuData) {
                    $scope.userMenu = menuData.data
                })
            }

            async function getUser() {
                try {
                    const userData = await GlobalServices.getUserProfile(
                        $cookies.getObject('MyMedQuestC00Ki3').token
                    )
                    if (userData.data.username !== undefined) {
                        $scope.user.username = userData.data.username
                        $scope.user.profileId = userData.data.profileId
                        $scope.user.ID = userData.data.ID
                        $scope.user.uniqueID = userData.data.uniqueID
                        $scope.user.profileType = userData.data.profileType
                        $scope.user.email = userData.data.email
                        $scope.user.Skype = userData.data.Skype
                        $scope.user.WhatsApp = userData.data.WhatsApp
                        $scope.user.phone = userData.data.phone
                        $scope.user.dateOfJoin = userData.data.dateOfJoin
                        $scope.user.address = userData.data.addres
                        $scope.user.status = userData.data.status
                        $scope.user.street = userData.data.street
                        $scope.user.country = userData.data.country
                        $scope.user.city = userData.data.city
                        $scope.user.state = userData.data.state
                        $scope.user.postalCode = userData.data.postalCode
                        $scope.user.timezone = userData.data.timezone
                        $rootScope.user = $scope.user

                        $rootScope.$emit('user-set')
                        if (
                            $scope.user.profileType != 'Admin' &&
                            $scope.user.profileType != GlobalEnums.AccountType.User &&
                            $scope.user.profileType != GlobalEnums.AccountType.Provider
                        ) {
                            location.href = '/index'
                        } else {
                            await getMenu($scope.user.profileId)
                            $scope.priviliges.remove = 1
                            // $scope.priviliges.update = 1
                            $scope.priviliges.create = 1
                            $rootScope.priviliges = $scope.priviliges
                            $rootScope.$emit('priviliges-set')
                            if (
                                $scope.user.profileType == GlobalEnums.AccountType.Provider ||
                                $scope.user.profileType == 'Admin'
                            ) {
                                $scope.cardType = 1
                                GlobalServices.getDataProviderInforDashBoard($scope.user.ID)
                                    .then(function(dataReport) {
                                        $scope.dataProviderObjects = dataReport.data

                                        if (dataReport.data != undefined) {
                                            if (dataReport.data.length != 0) {
                                                dataReport.data.forEach(function(data_) {
                                                    if (data_.CountToAccept !== 0) {
                                                        $scope.servicesForAcceptingData.push(
                                                            data_.CountToAccept
                                                        )
                                                        $scope.servicesForAcceptingLabels.push(
                                                            '(' +
                                                                data_.userId +
                                                                ')' +
                                                                data_.ServiceProcedureName
                                                        )
                                                    }

                                                    if (data_.CountAccepted !== 0) {
                                                        $scope.acceptedServicesData.push(
                                                            data_.CountAccepted
                                                        )
                                                        $scope.acceptedServicesLabels.push(
                                                            '(' +
                                                                data_.userId +
                                                                ')' +
                                                                data_.ServiceProcedureName
                                                        )
                                                    }
                                                })
                                            }
                                        }
                                    })
                                    .catch(function(err) {
                                        console.log('Unexpected Error : ' + '  ' + err + '  ')
                                    })

                                GlobalServices.getPendingAppoinments($scope.user.ID)
                                    .then(function(dataReport) {
                                        $scope.pendingAppoinmentList = dataReport.data
                                    })
                                    .catch(function(err) {
                                        GlobalServices.showToastMsg(
                                            'MyMedQ_MSG.PleaseContactTheAdministrator',
                                            'ERROR'
                                        )
                                        console.log('Unexpected Error : ' + '  ' + err + '  ')
                                    })
                            } else if ($scope.user.profileType == GlobalEnums.AccountType.User) {
                                $scope.cardType = 2

                                GlobalServices.getDataUserInforDashBoard($scope.user.ID)
                                    .then(function(dataReport1) {
                                        dataReport1.data.forEach(function(dataReport) {
                                            $scope.notificationOfConsultationLabels.push(
                                                '(' +
                                                    dataReport.ProviderId +
                                                    ')' +
                                                    dataReport.ServiceProcedureName
                                            )
                                            $scope.notificationOfConsultationData.push(1)
                                        })
                                    })
                                    .catch(function(err) {
                                        GlobalServices.showToastMsg(
                                            'MyMedQ_MSG.PleaseContactTheAdministrator',
                                            'ERROR'
                                        )
                                        console.log('Unexpected Error : ' + '  ' + err + '  ')
                                    })

                                GlobalServices.getDataUserInforHiredServicesDashBoard(
                                    $scope.user.ID
                                )
                                    .then(function(dataReport2) {
                                        dataReport2.data.forEach(function(dataReport) {
                                            $scope.notificationOfConsultationLabels.push(
                                                dataReport.ServiceProcedureName
                                            )
                                            $scope.notificationOfConsultationData.push(1)
                                        })
                                    })
                                    .catch(function(err) {
                                        GlobalServices.showToastMsg(
                                            'MyMedQ_MSG.PleaseContactTheAdministrator',
                                            'ERROR'
                                        )
                                        console.log('Unexpected Error : ' + '  ' + err + '  ')
                                    })

                                GlobalServices.getUserAppoinments($scope.user.ID)
                                    .then(function(dataReport) {
                                        $scope.pendingAppoinmentList = dataReport.data
                                    })
                                    .catch(function(err) {
                                        GlobalServices.showToastMsg(
                                            'MyMedQ_MSG.PleaseContactTheAdministrator',
                                            'ERROR'
                                        )
                                        console.log('Unexpected Error : ' + '  ' + err + '  ')
                                    })
                            } else if ($scope.user.profileType == 'Admin') {
                                $scope.cardType = 3
                            }
                        }
                    } else {
                        location.href = '/login'
                    }
                } catch (err) {
                    console.log(err)
                    GlobalServices.showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                    location.href = '/login'
                }
            }

            async function getMessages() {
                if (
                    $scope.user.profileType == GlobalEnums.AccountType.Provider ||
                    $scope.user.profileType == 'Admin'
                ) {
                    const messages = await GlobalServices.getAllProviderMessages($scope.user)
                    $scope.messages = messages.data
                    $scope.messages.unreadMessages = 0
                    $scope.messages.unreadServiceMessages = 0

                    messages.data.forEach(message => {
                        if (message.message_Read == 0 && message.message_Type == 'Message') {
                            $scope.messages.unreadMessages++
                        } else if (
                            !message.message_Read &&
                            message.message_status == 1 &&
                            (message.message_Type == 'Consultation' ||
                                message.message_Type == 'Procedure')
                        ) {
                            $scope.messages.unreadServiceMessages++
                        }
                    })
                }
                if ($scope.user.profileType == GlobalEnums.AccountType.User) {
                    const messages = await GlobalServices.getAllUserMessages($scope.user)
                    $scope.messages = messages.data
                    $scope.messages.unreadMessages = 0
                    $scope.messages.unreadServiceMessages = 0

                    messages.data.forEach(message => {
                        if (message.message_Read == 0 && message.message_Type == 'Message') {
                            $scope.messages.unreadMessages++
                        } else if (
                            !message.message_Replied &&
                            message.message_status == 1 &&
                            (message.message_Type == 'Consultation' ||
                                message.message_Type == 'Procedure')
                        ) {
                            $scope.messages.unreadServiceMessages++
                        }
                    })
                }
            }

            setTimeout(() => {
                refreshProfile()
            }, 500)

            setInterval(async function() {
                refreshProfile()
            }, 60000)

            async function refreshProfile() {
                getMessages()
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
