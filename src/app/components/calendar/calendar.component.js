'use strict'
import moment from 'moment'
angular.module('calendarModule', []).component('calendarComponent', {
    templateUrl: './app/components/calendar/calendar.component.html',
    bindings: { appointments: '<', highlightedCard: '=' },
    config: function config() {},
    controller: [
        '$location',
        '$anchorScroll',
        function CalendarController($location, $anchorScroll) {
            const ctrl = this
            ctrl.events = []
            this.$onChanges = function({ appointments }) {
                if (angular.isDefined(appointments)) {
                    ctrl.appointments = appointments.currentValue
                    if (!ctrl.events.length) {
                        formatAppointmentDates(ctrl.appointments)
                    }
                }
            }

            function formatAppointmentDates(appointments) {
                appointments.forEach(appointment => {
                    const appointment_date = moment(appointment.appointment_Date).format()
                    const appointment_days = appointment.appointment_Days

                    const color =
                        appointment.appointment_Type == 'Consultation' ? 'green' : 'dark green'
                    const date = moment(appointment_date)
                    ctrl.events.push({
                        title: appointment.appointment_Type,
                        name: appointment.procedure_Name,
                        start: date,
                        color: appointment_days > 0 ? color : 'purple',
                        appointment_id: appointment.appointment_ID,
                        displayEventTime: true,
                        textColor: 'red',
                        display: 'background',
                    })
                })

                ctrl.eventSources = [{ events: ctrl.events }]
                ctrl.uiConfig = {
                    calendar: {
                        height: 900,
                        editable: false,
                        header: {
                            left: 'month basicWeek basicDay',
                            right: 'prev,next',
                            center: 'title',
                        },
                        eventClick: function(event) {
                            Object.assign(ctrl.highlightedCard, {
                                appointment_id: event.appointment_id,
                            })
                            $location.hash(event.appointment_id)
                            $anchorScroll()
                        },
                        eventRender: function(eventObj, $el) {
                            $el.popover({
                                title: eventObj.title,
                                content: eventObj.name,
                                trigger: 'hover',
                                placement: 'top',
                                container: 'body',
                            })
                        },
                    },
                }
            }
            //https://fullcalendar.io/docs/v3/event-object
            //https://fullcalendar.io/docs/event-source-object
        },
    ],
})
