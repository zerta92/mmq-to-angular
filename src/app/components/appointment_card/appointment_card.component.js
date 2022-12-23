import { GoogleCalendar } from 'datebook'
import moment from 'moment'
import { GlobalEnums } from '../../utils/global_enums'

angular.module('appointmentCardModule', []).component('appointmentCard', {
    templateUrl: './app/components/appointment_card/appointment_card.component.html',
    bindings: {
        appointment: '<',
        user: '<',
        video: '=',
        highlightedCard: '=',
        selectedAppointment: '=',
    },
    controller: [
        '$rootScope',
        'DashboardServices',
        'GlobalServices',
        'FollowUpServices',
        'ServiceManagerServices',
        '$mdDialog',
        '$window',
        '$location',
        function AppointmentCardController(
            $rootScope,
            DashboardServices,
            GlobalServices,
            FollowUpServices,
            ServiceManagerServices,
            $mdDialog,
            $window,
            $location
        ) {
            var ctrl = this
            const showToastMsg = GlobalServices.showToastMsg
            ctrl.is_toolbar_open = false
            ctrl.selectedMode = 'md-scale'
            ctrl.selectedModeAction = 'md-scale'
            ctrl.request_documents_flag = { status: false }
            ctrl.is_appointment_time = false
            ctrl.meeting_has_started = false
            ctrl.is_past_appointment = false

            /* Fixes tooltip inside card toolbar*/
            setTimeout(function() {
                $('.pevents__initial').removeClass('pevents__initial')
            }, 1000)

            $rootScope.$on('meeting-started', function(event, data) {
                if (ctrl.appointment.appointment_ID == data.appointment_ID) {
                    ctrl.meeting_has_started = true
                }
            })

            $rootScope.$on('meeting-ended', function(event, data) {
                if (ctrl.appointment.appointment_ID == data.appointment_ID) {
                    ctrl.meeting_has_started = false
                }
            })

            $rootScope.$on('meeting-time', function(event, appointment_ID) {
                if (ctrl.appointment.appointment_ID == appointment_ID) {
                    ctrl.is_appointment_time = true
                }
            })

            const load_demo_appointments = window.location.href.includes('load_demo')

            this.$onChanges = function(vars) {
                if (angular.isDefined(vars)) {
                    ctrl.user = vars.user.currentValue
                    ctrl.showAppointmentServices = true
                    ctrl.getAllAppointmentServices()
                    ctrl.checkAppointmentDateTime()
                    ctrl.formatUTCToLocalTime()
                    isPastAppointmentTime()
                }
            }

            ctrl.requestDocuments = function() {
                ctrl.request_documents_flag.status = true
            }

            ctrl.cancelAppointment = async function() {
                const cancel_response = await ServiceManagerServices.showCancelServiceWarning(
                    event,
                    ctrl.user.profileType == GlobalEnums.AccountType.User ? 'dentist' : 'patient'
                )

                if (!cancel_response) {
                    return
                }
                const {
                    data: [message],
                } = await GlobalServices.getMessageByAppointmentId(
                    ctrl.appointment.appointment_ID,
                    GlobalEnums.AccountType.Provider
                )
                const message_ID = message.message_ID
                if (!message_ID) {
                    showToastMsg('No related message id found', 'ERROR')
                }
                const appointment_data = [
                    {
                        related_Appointment: ctrl.appointment.appointment_ID,
                        appointment_Date: ctrl.appointment.appointment_Date,
                        message_Type: ctrl.appointment.appointment_Type,
                        message_Sender:
                            ctrl.user.profileType == GlobalEnums.AccountType.User
                                ? ctrl.appointment.provider_ID
                                : ctrl.appointment.user_ID,
                        message_Receiver:
                            ctrl.user.profileType == GlobalEnums.AccountType.User
                                ? ctrl.appointment.user_ID
                                : ctrl.appointment.provider_ID,
                        message_ServiceID: ctrl.appointment.service_ID,
                        message_appointmentMethod: ctrl.appointment.appointment_Method,
                        message_ID,
                    },
                ]
                if (ctrl.user.profileType == GlobalEnums.AccountType.User) {
                    await GlobalServices.userCancelAppointment(appointment_data)
                    showToastMsg('Appointment Cancelled', 'SUCCESS')
                    return
                }
                await GlobalServices.providerCancelAppointment(appointment_data)
                showToastMsg('Appointment Cancelled', 'SUCCESS')
            }

            ctrl.getShoppingCart = async function(id) {
                if (load_demo_appointments) {
                    return
                }

                const { data: cartcb } = await DashboardServices.getCartIDByAppointmentID({
                    appointment_ID: id,
                })
                if (cartcb.length <= 0) {
                    showToastMsg('MyMedQ_MSG.Appointment.NoAppointmentForService', 'ERROR')
                } else {
                    $location.search('cartId', cartcb[0].cart_ID)
                    $location.path('/shoppingCart')
                }
            }

            ctrl.hiredServicesLabels = []
            ctrl.hiredServicesData = []
            ctrl.hiredServicesObjs = []
            ctrl.colorsGrapicPYS = [
                '#3F51B5',
                '#FFC400',
                '#6D4C41',
                '#607D8B',
                '#7B1FA2',
                '#827717',
                '#BF360C',
                '#D500F9',
                '#2979FF',
                '#1DE9B6',
                '#C6FF00',
                '#FF9100',
                '#BDBDBD',
                '#18FFFF',
                '#B2FF59',
            ]

            ctrl.getAllAppointmentServices = async function() {
                ctrl.services = ''
                const appointment_services = await DashboardServices.getAllAppointmentServices(
                    {
                        appointment_ID: ctrl.appointment.appointment_ID,
                    },
                    load_demo_appointments
                )
                const services = appointment_services.data
                ctrl.services = services
                ctrl.formatServicesForChart()
            }

            ctrl.formatServicesForChart = function() {
                ctrl.services.forEach(function(dataReport) {
                    ctrl.hiredServicesLabels.push(
                        dataReport.cart_Quantity + ' X ' + dataReport.procedure_Name + ' $'
                    )
                    ctrl.hiredServicesData.push(dataReport.cart_Cost)
                    ctrl.hiredServicesObjs.push(dataReport)
                })
                ctrl.show = true
            }

            function getFeedback(appointmentID) {
                return new Promise(function(resolve, reject) {
                    DashboardServices.getConsultationFeedback(appointmentID)
                        .then(function(feedback) {
                            if (feedback.data.status < 0) {
                                reject(feedback.data.message)
                            } else {
                                resolve(feedback.data)
                            }
                        })
                        .catch(function(err) {
                            showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                            reject('Unexpected Error : ' + '  ' + err.status + '  ' + err.data)
                        })
                })
            }

            ctrl.newChat = function(appointment) {
                if (load_demo_appointments) {
                    return
                }
                if (ctrl.user.profileType == GlobalEnums.AccountType.Provider) {
                    ctrl.chat = {}
                    ctrl.chat.message_Sender = appointment.provider_ID
                    ctrl.chat.message_Receiver = appointment.user_ID
                    ctrl.chat.message_Type = 'Message'
                    ctrl.chat.message_Content = 'New chat'
                    ctrl.chat.service_ID = appointment.service_ID
                    DashboardServices.startChatWithUser(ctrl.chat)
                        .then(function(chat) {
                            location.href = '#!/openMessage?messageID=' + chat.data.message
                        })
                        .catch(function(err) {
                            showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                        })
                } else if (ctrl.user.profileType == GlobalEnums.AccountType.User) {
                    ctrl.chat = {}
                    ctrl.chat.message_Sender = appointment.user_ID
                    ctrl.chat.message_Receiver = appointment.provider_ID
                    ctrl.chat.message_Type = 'Message'
                    ctrl.chat.message_Content = 'New chat'
                    ctrl.chat.service_ID = appointment.service_ID
                    DashboardServices.startChatWithProvider(ctrl.chat)
                        .then(function(chat) {
                            location.href = '#!/openMessage?messageID=' + chat.data.message
                        })
                        .catch(function(err) {
                            showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                            console.log('Unexpected Error : ' + '  ' + err)
                        })
                }
            }

            ctrl.appointmentFollowUp = function(ev, appointment) {
                if (load_demo_appointments) {
                    return
                }
                getFeedback(appointment.appointment_ID)
                    .then(function(feedback) {
                        $mdDialog
                            .show({
                                locals: {
                                    appointmentObj: appointment,
                                    followUp: feedback,
                                    user: ctrl.user,
                                },
                                controller: [
                                    '$scope',
                                    '$mdDialog',
                                    'appointmentObj',
                                    'followUp',
                                    'user',
                                    DialogController,
                                ],
                                focusOnOpen: false,
                                templateUrl: './app/components/follow_up/follow_up.component.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                clickOutsideToClose: false,
                            })
                            .then(function() {
                                getFeedback(appointment.appointment_ID)
                                    .then(function(feedback) {
                                        if (feedback[0] != undefined) {
                                            appointment.followUp_Status_User =
                                                feedback[0].followUp_Status_User
                                            appointment.followUp_Status_Provider =
                                                feedback[0].followUp_Status_Provider
                                        }
                                    })
                                    .catch(function(err) {
                                        showToastMsg(
                                            'MyMedQ_MSG.PleaseContactTheAdministrator',
                                            'ERROR'
                                        )
                                        console.log('Unexpected Error : ' + '  ' + err)
                                    })
                            })
                    })
                    .catch(function(err) {
                        showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                        console.log('Unexpected Error : ' + '  ' + err)
                    })
            }

            function DialogController($scope, $mdDialog, appointmentObj, followUp, user) {
                FollowUpServices.DialogController($scope, $mdDialog, appointmentObj, followUp, user)
            }

            ctrl.formatUTCToLocalTime = function() {
                ctrl.appointment.appointment_time_local = moment(
                    ctrl.appointment.appointment_Date
                ).format('hh:mm:ss a')
            }

            function isPastAppointmentTime() {
                ctrl.is_past_appointment = moment().isAfter(ctrl.appointment.appointment_Date)
            }

            ctrl.startVideoCall = function() {
                if (!ctrl.is_appointment_time) {
                    return
                }
                ctrl.video.show = true
                Object.assign(ctrl.selectedAppointment, ctrl.appointment)
                $window.scrollTo(0, angular.element('twilio-video').offsetTop)
            }

            ctrl.startSkypeCall = function() {
                window.location.href = `skype:${ctrl.appointment.skype_account}?call&video=true}`
            }

            ctrl.joinVideoCall = function() {
                ctrl.video.show = true
                Object.assign(ctrl.selectedAppointment, ctrl.appointment)
                $window.scrollTo(0, angular.element('twilio-video').offsetTop)
            }

            ctrl.showProcedureLocation = function(ev) {
                const {
                    providerStreetAddress: procedure_address,
                    clientName: provider_name,
                } = ctrl.appointment
                $mdDialog.show(
                    $mdDialog
                        .alert()
                        .clickOutsideToClose(true)
                        .title(`${provider_name}`)
                        .textContent(`${procedure_address}`)
                        .ariaLabel('Provider Address')
                        .ok('Close')
                        .targetEvent(ev)
                )
            }

            ctrl.checkAppointmentDateTime = function() {
                const { appointment_Date, appointment_Type } = ctrl.appointment

                if (!appointment_Type.includes('Consultation')) {
                    return
                }

                const appointment_date_plus_half_hour = moment(appointment_Date).add(60, 'minutes')

                if (
                    moment().isAfter(appointment_Date) &&
                    moment().isBefore(appointment_date_plus_half_hour) &&
                    ctrl.appointment.appointment_Paid
                ) {
                    ctrl.is_appointment_time = true
                }
            }

            ctrl.addToGoogleCalendar = function(appointment) {
                const is_user = ctrl.user.profileType == GlobalEnums.AccountType.User
                const call_to_action = is_user
                    ? 'Please have the documents the dentist requested available during your appointment'
                    : ''
                const appointment_date_plus_half_hour = moment(appointment.appointment_Date)
                    .add(60, 'minutes')
                    .format()

                const options = {
                    title: `MyMedQuest ${appointment.appointment_Type}`,
                    description: `MyMedQuest ${appointment.appointment_Type}: ${appointment.procedure_Name}. ${call_to_action}`,
                    start: new Date(appointment.appointment_Date),
                    end: new Date(appointment_date_plus_half_hour),
                }

                const googleCalendar = new GoogleCalendar(options)

                const calendar_url = googleCalendar.render()

                $window.open(calendar_url, '_blank')
            }
        },
    ],
})
