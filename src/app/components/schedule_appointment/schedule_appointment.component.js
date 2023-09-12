'use strict'

angular.module('scheduleAppointmentModule').component('scheduleAppointment', {
    bindings: {
        user: '<',
        provider: '<',
        service: '<',
        documents: '<',
        servicesList: '<',
        isModalOpen: '<',
    },
    controller: [
        '$rootScope',
        'ListServices',
        'GlobalServices',
        '$location',
        '$timeout',
        '$mdDialog',
        function ScheduleAppointmentController(
            $rootScope,
            ListServices,
            GlobalServices,
            $location,
            $timeout,
            $mdDialog
        ) {
            var ctrl = this
            const showToastMsg = GlobalServices.showToastMsg
            let modalIsOpened = false

            this.$onChanges = function(vars) {
                if (angular.isDefined(vars)) {
                    ctrl.user.method = 'Video' //default consultation method

                    ctrl.selectedService = ctrl.service //default service loaded to populate dropdown
                    if (ctrl.isModalOpen && !modalIsOpened) {
                        modalIsOpened = true
                        // $rootScope.trackCustomerAction({
                        //     action: 'opened_schedule_consultation_window',
                        //     url: $location.absUrl(),
                        //     agent: window.navigator.userAgent,
                        // })

                        window.dataLayer = window.dataLayer || []
                        dataLayer.push({
                            event: 'formSubmission',
                            formType: 'Open Consultation Modal',
                        })

                        $mdDialog
                            .show({
                                locals: {
                                    service: ctrl.service,
                                    user: ctrl.user,
                                    provider: ctrl.provider,
                                    servicesList: ctrl.servicesList,
                                    documents: ctrl.documents,
                                },
                                controller: [
                                    'service',
                                    'user',
                                    'provider',
                                    'servicesList',
                                    'documents',
                                    ScheduleAppointmentControllerModal,
                                ],
                                controllerAs: 'vm',
                                templateUrl:
                                    './app/components/schedule_appointment/schedule_appointment.component.html',
                                parent: angular.element(document.body),
                                // targetEvent: ev,
                                clickOutsideToClose: false,
                                fullscreen: false,
                            })
                            .then(function() {
                                $rootScope.$broadcast('schedule-appointment-dialog-closed')
                                modalIsOpened = false
                                return
                            })
                            .catch(function() {
                                return
                            })
                    }
                }
            }
            ctrl.submit = {}
            ctrl.optionItems = {}
            ctrl.selectedService = {}

            let OptionsSelected = []
            let firstOption = ''
            let addedOptions = []
            let noOptions = true

            var shoppingCartAmount = 0
            function ScheduleAppointmentControllerModal(
                service,
                user,
                provider,
                servicesList,
                documents
            ) {
                const ctrl = this
                ctrl.selectedService = service
                ctrl.service = service
                ctrl.servicesList = servicesList
                ctrl.user = user
                ctrl.provider = provider
                ctrl.documents = documents
                ctrl.submit = {}
                ctrl.optionItems = {}

                ctrl.goTo = function(redirect_to) {
                    ctrl.closeModal()
                    /* Allows for the modal to be dismissed */
                    $timeout(() => {
                        const hospitalID = ctrl.selectedService.provider_ID
                        const procedure = ctrl.selectedService.procedure_ID

                        $location.url(`/${redirect_to}`)
                        $location.search(
                            'redirect_to',
                            `/service_details/provider/${hospitalID}/service/${procedure}`
                        )
                    }, 1000)
                }

                ctrl.closeModal = function() {
                    $mdDialog.hide()
                }

                ctrl.makeAppointment = function(invalid, service, user, optionItems, e) {
                    if (invalid) {
                        return
                    }

                    ctrl.closeModal()

                    if (!ctrl.user.ID) {
                        showToastMsg('MyMedQ_MSG.List.NeedLogIngE1', 'ERROR')
                    } else if (
                        ctrl.user.ID == service.provider_ID &&
                        ctrl.user.profileType == 'Provider'
                    ) {
                        showToastMsg('MyMedQ_MSG.List.SingOwnPE1', 'ERROR')
                    } else if (ctrl.user.profileType == 'Provider') {
                        showToastMsg('MyMedQ_MSG.List.NeedLogIngE3', 'ERROR')
                    } else {
                        const serviceToSchedule = angular.copy(service)
                        serviceToSchedule.messageType =
                            ctrl.selectedService.messageType || 'Consultation'
                        serviceToSchedule.service_ID = ctrl.selectedService.service_ID
                        serviceToSchedule.procedure_Name = ctrl.selectedService.procedure_Name
                        serviceToSchedule.price = ctrl.selectedService.price
                        serviceToSchedule.service_consultationCost =
                            ctrl.selectedService.service_consultationCost
                        serviceToSchedule.procedure_ID = ctrl.selectedService.procedure_ID

                        GlobalServices.requestAppointment(serviceToSchedule, user).then(function(
                            appointment
                        ) {
                            if (appointment.data.status == -2) {
                                ctrl.submit.confirmation =
                                    'You have already registered for this procedure, please check your dashboard'
                                showToastMsg('MyMedQ_MSG.List.ProcedureAlreadyRE1', 'ERROR')
                            } else if (appointment.data.status < 0) {
                                ctrl.submit.confirmation = appointment.data.message
                                showToastMsg(appointment.data.message, 'ERROR')
                            } else {
                                let provider_Msg = appointment.data.provider_msg
                                let user_Msg = appointment.data.user_msg

                                ctrl.submit.confirmation =
                                    'Your request has been submitted, please wait for the hospital to confirm'
                                showToastMsg('MyMedQ_MSG.List.RequestOkSuccessMsg1', 'SUCCESS')
                                window.dataLayer = window.dataLayer || []
                                dataLayer.push({
                                    event: 'formSubmission',
                                    formType: 'Schedule Consultation',
                                })
                                //recursive function to add option items to cart
                                var addServiceWithoutOptions = true
                                Object.keys(optionItems).forEach(function(key) {
                                    try {
                                        optionItems[key].forEach(function(elem) {
                                            if (elem.selected == true) {
                                                noOptions = false
                                                //this condition as is or skip to next iteration since we already have that option
                                                if (OptionsSelected.indexOf(key) <= -1) {
                                                    OptionsSelected.push(key)
                                                }
                                                addServiceWithoutOptions = false
                                            }
                                        })
                                    } catch (err) {
                                        console.log(err)
                                    }
                                })
                                prepareService(
                                    null,
                                    user,
                                    serviceToSchedule,
                                    optionItems,
                                    null,
                                    true,
                                    user_Msg,
                                    provider_Msg,
                                    addServiceWithoutOptions
                                )
                                setTimeout(function() {
                                    let paymentNotificationData = {
                                        cart_ID: ctrl.globalCartID,
                                        user_ID: user.ID,
                                        provider_ID: service.provider_ID,
                                        amount: shoppingCartAmount,
                                        form: 'list.html',
                                        step: 1,
                                        type: 'Cart',
                                    }
                                    paymentNotificationData.status = 'SUCCESS'
                                    paymentNotificationData.message = 'shopping cart created'
                                    ListServices.sendPaymentProcessEmail(
                                        paymentNotificationData
                                    ).then(function(notification) {
                                        window.location.href =
                                            'adminMedquest/#!/userServicesManager'
                                    })
                                }, 3000)
                            }
                        })
                    }
                }
            }

            function prepareService(
                globalCartID,
                user,
                service,
                optionItems,
                key,
                init,
                user_Msg,
                provider_Msg,
                addServiceWithoutOptions
            ) {
                let itemsList = []
                let userService = {}

                if (addServiceWithoutOptions || init) {
                    userService.option = 0
                    userService.items = null
                }
                userService.user_ID = user.ID
                userService.message_ID = user_Msg
                userService.service_ID = service.service_ID
                userService.provider_ID = service.provider_ID
                userService.cart_PriceFactor = service.service_PriceFactor / 100
                userService.cart_Cost = init ? service.price : 0
                userService.cart_realPrice = init ? service.price : 0
                userService.service_consultationCost = service.service_consultationCost
                userService.service_providerSetPrice = 0
                if (init && !addServiceWithoutOptions) {
                    firstOption = OptionsSelected[0] //was Object.keys(optionItems)[0];
                    key = firstOption
                } else if (!init && !addServiceWithoutOptions) {
                    userService.cart_ID = globalCartID
                }

                if (!addServiceWithoutOptions) {
                    try {
                        if (!init) {
                            //first iteration needs to be option 0
                            optionItems[key].forEach(function(elem) {
                                if (elem.selected == true) {
                                    noOptions = false
                                    userService.option = key
                                    itemsList.push(elem.item_ID)
                                    //add item price to cart cost and cart real price
                                    userService.cart_Cost +=
                                        elem.item_priceAdder * userService.cart_PriceFactor
                                    userService.cart_realPrice +=
                                        elem.item_priceAdder * userService.cart_PriceFactor
                                }
                            })
                        }
                        shoppingCartAmount += userService.cart_Cost
                        userService.items = itemsList
                        itemsList = []
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    shoppingCartAmount += userService.cart_Cost
                }

                ListServices.setUserService(userService).then(function(service) {
                    if (service.data.status == -2) {
                        ctrl.submit.confirmation =
                            'You have already registered for this procedure, please check your dashboard'
                        showToastMsg('MyMedQ_MSG.List.ProcedureAlreadyRE1', 'ERROR')
                        deleteMessages(user_Msg, provider_Msg)
                    } else if (service.data.status < 0) {
                        ctrl.submit.confirmation = service.data.message
                        showToastMsg('MyMedQ_MSG.List.RequestErrorE1', 'ERROR')
                        deleteMessages(user_Msg, provider_Msg)
                    } else {
                        addedOptions.push(service.data.option)
                        cartCreated = true
                        globalCartID = service.data.cart_ID
                        ctrl.globalCartID = service.data.cart_ID //give global access to process notification
                        if (!noOptions && !addServiceWithoutOptions) {
                            OptionsSelected.forEach(function(key) {
                                if (addedOptions.indexOf(key) <= -1) {
                                    //skip if already added
                                    prepareService(
                                        globalCartID,
                                        user,
                                        service,
                                        optionItems,
                                        key,
                                        false,
                                        user_Msg,
                                        provider_Msg,
                                        addServiceWithoutOptions
                                    )
                                }
                            })
                        }
                    }
                })
            }

            function deleteMessages(user_msg, provider_msg) {
                let msgArrayUser = []
                msgArrayUser.push(user_msg)
                let msgArrayProvider = []
                msgArrayProvider.push(provider_msg)
                ListServices.userDeleteSelectedServices(msgArrayUser).then(function(msgcb) {
                    if (msgcb.data.status < 0) {
                        console.log('error deleting user message')
                    } else {
                        ListServices.deleteSelectedServices(msgArrayProvider).then(function(msgcb) {
                            if (msgcb.data.status < 0) {
                                console.log('error deleting provider message')
                            } else {
                                console.log('deleting messages successfull')
                            }
                        })
                    }
                })
            }
        },
    ],
})
