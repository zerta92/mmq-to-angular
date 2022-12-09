'use strict'

angular.module('contactProviderModule').component('contactProvider', {
    bindings: {
        user: '<',
        service: '<',
        isModalOpen: '<',
    },
    controller: [
        '$rootScope',
        'ListServices',
        'GlobalServices',
        '$mdDialog',
        function ContactProviderModuleController(
            $rootScope,
            ListServices,
            GlobalServices,
            $mdDialog
        ) {
            var ctrl = this
            const showToastMsg = GlobalServices.showToastMsg

            let modalIsOpened = false
            this.$onChanges = function(vars) {
                if (angular.isDefined(vars)) {
                    ctrl.user.method = 'Video' //default consultation method
                    if (ctrl.service) {
                        ctrl.selectedService = ctrl.service //default service loaded to populate dropdown

                        if (ctrl.isModalOpen && !modalIsOpened) {
                            modalIsOpened = true
                            $mdDialog
                                .show({
                                    locals: {
                                        service: ctrl.service,
                                        user: ctrl.user,
                                    },
                                    controller: ['service', 'user', ContactProviderControllerModal],
                                    controllerAs: 'vm',
                                    templateUrl:
                                        './app/components/contact_provider/contact_provider.component.html',
                                    parent: angular.element(document.body),
                                    clickOutsideToClose: false,
                                    fullscreen: false,
                                })
                                .then(function() {
                                    $rootScope.$broadcast('contact-provider-dialog-closed')
                                    modalIsOpened = false
                                    return
                                })
                                .catch(function() {
                                    return
                                })
                        }
                    }
                }
            }

            function ContactProviderControllerModal(service, user) {
                const ctrl = this
                ctrl.selectedService = service
                ctrl.user = user
                ctrl.message = { confirmation: '' }
                ctrl.submit = { confirmation: '' }
                ctrl.goTo = function(redirect_to) {
                    ctrl.closeModal()
                    /* Allows for the modal to be dismissed */
                    $timeout(() => {
                        const hospitalID = ctrl.selectedService.provider_ID
                        const procedure = ctrl.selectedService.procedure_ID

                        $location.url(`/${redirect_to}`)
                        $location.search(
                            'redirect_to',
                            `/service_details?hospitalID=${hospitalID}&procedure=${procedure}`
                        )
                    }, 1000)
                }

                ctrl.closeModal = function() {
                    $mdDialog.hide()
                }

                ctrl.sendMessage = function(selectedService, user, e) {
                    selectedService.messageType = 'Message'

                    if (!user.ID) {
                        showToastMsg('MyMedQ_MSG.List.NeedLogIngE1', 'ERROR')
                    } else if (user.ID == selectedService.provider_ID) {
                        showToastMsg('MyMedQ_MSG.List.NeedLogIngE2', 'ERROR')
                    } else if (user.profileType == 'Provider') {
                        showToastMsg('MyMedQ_MSG.List.NeedLogIngE3', 'ERROR')
                    } else {
                        ListServices.contactProvider(selectedService, user).then(function(message) {
                            if (message.data.status < 0) {
                                ctrl.submit.confirmation = message.data.message
                                showToastMsg('MyMedQ_MSG.List.RequestErrorE2', 'ERROR')
                            } else {
                                ctrl.message.confirmation =
                                    'Your message has been sent, please wait for the hospital to reply'
                                showToastMsg('MyMedQ_MSG.List.AppSuccessMsg1', 'SUCCESS')
                            }
                        })
                    }
                }
            }
        },
    ],
})
