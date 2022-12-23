'use strict'
import moment from 'moment'
angular.module('selectDatetimeModule', ['moment-picker']).component('selectDatetime', {
    templateUrl: './app/components/select_datetime/select_datetime.component.html',
    bindings: {
        message: '<',
        user: '<',
    },
    controller: function AppointmentCardController(
        ServiceManagerServices,
        DashboardServices,
        GlobalServices,
        $translate
    ) {
        const ctrl = this
        const showToastMsg = GlobalServices.showToastMsg
        ctrl.data_loaded = false

        ctrl.isSelectable = function(date, type) {
            const blackout_dates = ctrl.all_pending_appointments.map(a =>
                moment(a.appointment_Date).format('YYYY-MM-DD HH:MM')
            )
            const current_day = moment().format('YYYY-MM-DD')
            const current_month = moment().format('MM')

            if (type == 'month' && date.format('MM') < current_month) {
                return false
            }
            if (type == 'day' && date.format('YYYY-MM-DD') < current_day) {
                return false
            }
            if (blackout_dates.includes(date.format('YYYY-MM-DD HH:MM'))) {
                return false
            }
            return true
        }

        this.$onChanges = async function(vars) {
            if (angular.isDefined(vars)) {
                ctrl.user = vars.user.currentValue
                const provider_id =
                    ctrl.user.profileType == 'Provider' ? ctrl.user.ID : ctrl.message.message_Sender
                const {
                    data: all_pending_appointments,
                } = await DashboardServices.getPendingAppoinments(provider_id)
                ctrl.all_pending_appointments = all_pending_appointments || []
                ctrl.data_loaded = true
                //xxx this causes a invalid time format error in time input container
                ctrl.setDayAndTime()
            }
        }

        ctrl.setDayAndTime = function() {
            if (!ctrl.message.appointment_Time) {
                ctrl.message.appointment_Time = moment(ctrl.message.appointment_Date).format()
            }
        }

        ctrl.rescheduleSelected = async function(message) {
            if (message.appointment_Date == undefined || message.appointment_Time == undefined) {
                const datetime_error = await $translate('MyMedQ_MSG.ProviderS.EnterDatetime')
                message.message_Error = datetime_error
                showToastMsg('MyMedQ_MSG.ProviderS.EnterDatetime', 'ERROR')
                return
            }

            message.chooseDate = true
            const relevant_appointment_id = message.related_Appointment || message.appointment_ID
            const provider_ID = message.provider_ID || message.message_Receiver
            ServiceManagerServices.reSchedule({
                appointment_nTime: message.appointment_Date,
                appointment_newDate: message.appointment_Date,
                appointment_ID: relevant_appointment_id,
                appointment_Status: message.appointment_Status,
                provider_ID,
                validate_linked_accounts: true,
            }).then(function(rescheduleCb) {
                if (rescheduleCb.data.status < 0) {
                    showToastMsg('servicesManager.rescheduleError', 'ERROR')
                } else {
                    ServiceManagerServices.notifyUserOfReSchedule({
                        appointment_ID: relevant_appointment_id,
                    })
                    message.chooseDate = false
                    message.changeDate = false
                    message.appointment_Date = moment(rescheduleCb.data.message).format(
                        'DD/MMM/yyyy h:mm a'
                    )

                    message.appointment_time_local = moment(rescheduleCb.data.message).format(
                        'hh:mm:ss a'
                    )

                    showToastMsg('servicesManager.rescheduleSuccess', 'SUCCESS')
                    window.location.reload()
                }
            })
        }

        ctrl.cancelDateChange = function() {
            ctrl.message.chooseDate = false
            ctrl.message.changeDate = false
        }
    },
})
