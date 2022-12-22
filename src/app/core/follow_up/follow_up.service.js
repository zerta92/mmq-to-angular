'use strict'

import _ from 'lodash'
angular.module(`core.followUp`, []).factory(`FollowUpServices`, [
    'DashboardServices',
    'ShoppingCartServices',
    'DocumentsServices',
    'GlobalServices',
    function(DashboardServices, ShoppingCartServices, DocumentsServices, GlobalServices) {
        return {
            DialogController: async function(ctrl, $mdDialog, appointmentObj, followUp, user) {
                const followUpService = this

                ctrl.message = {
                    chooseDate: true,
                    appointment_Date: '',
                    appointment_Time: '',
                }
                ctrl.user = user
                ctrl.appointment = appointmentObj
                ctrl.newAppointment = {}
                ctrl.followUp = followUp
                ctrl.newFollowUp = { followUp_Status_Provider: true, followUp_Status_User: true }
                ctrl.Documents = []
                ctrl.selectedDocuments = {}
                ctrl.selectedDocuments.documents = []
                ctrl.addServiceCheckbox = false
                ctrl.shoppingCart = {}
                ctrl.total = {}
                ctrl.service_options = {}
                ctrl.service_brands = []
                ctrl.notes = ''
                ctrl.directPriceChange = {}
                let cartInfo = {}
                cartInfo = {
                    cart_ID: ctrl.appointment.cart_ID,
                    requestor_ID: ctrl.user.ID,
                    requestor_Type: ctrl.user.profileType,
                    appointment_ID: ctrl.appointment.appointment_ID,
                    user_ID: ctrl.appointment.user_ID,
                    provider_ID: ctrl.appointment.provider_ID,
                }
                const cart = await DashboardServices.getCartById({
                    cart_ID: ctrl.appointment.cart_ID,
                })
                const cart_data = cart.data

                ctrl.shoppingCart = Object.assign(ctrl.shoppingCart, cart_data.shoppingCart)
                ctrl.shoppingCartOriginal = _.cloneDeep(ctrl.shoppingCart)
                ctrl.total = Object.assign(ctrl.total, cart_data.total)
                ctrl.service_options = Object.assign(
                    ctrl.service_options,
                    cart_data.service_options
                )
                ctrl.service_brands = cart_data.service_brands
                ctrl.notes = cart_data.notes

                ctrl.updatePrice = function(service, price) {
                    if (!price) {
                        price = 0
                    }
                    ctrl.total.amount = 0
                    Object.keys(ctrl.shoppingCart).forEach(service => {
                        ctrl.total.amount += ctrl.shoppingCart[service][0].cart_Cost
                    })
                    ctrl.directPriceChange[service] = true
                }

                DashboardServices.getAllDocumentsRequiredByServiceId(
                    ctrl.appointment.service_ID
                ).then(function(documents) {
                    ctrl.Documents = []
                    documents.data.forEach(async function(doc) {
                        const documentObj = await DocumentsServices.getDocumentsByDocumentId({
                            document_ID: doc.required_doc_ID,
                            // validate_linked_accounts: true,
                        })

                        ctrl.Documents.push(documentObj.data[0])
                    })
                })

                ctrl.addCustomDocument = function() {
                    let newDoc = {}
                    newDoc.required_doc_Name = ctrl.selectedDocuments.newdoc.name
                    newDoc.required_doc_Description = ctrl.selectedDocuments.newdoc.description
                    ctrl.selectedDocuments.documents.push(newDoc)
                    ctrl.selectedDocuments.newdoc = null
                }

                ctrl.newDocChip = function(chip) {
                    return {
                        required_doc_Name: chip,
                        required_doc_Description: 'No Description',
                    }
                }

                ctrl.allowedQuantities = [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18,
                    19,
                    20,
                ]

                ctrl.userAnswer = async function(answer) {
                    ctrl.newFollowUp.appointment_ID = ctrl.appointment.appointment_ID
                    ctrl.newFollowUp.followUp_Status_User = ctrl.newFollowUp.followUp_Status_User
                        ? 1
                        : 0
                    let message = {}
                    if (ctrl.followUp.length == 0) {
                        message.followUp_Status_Provider = null
                    } else {
                        message.followUp_Status_Provider = ctrl.followUp[0].followUp_Status_Provider
                            ? 1
                            : 0
                    }

                    if (
                        ctrl.newFollowUp.followUp_Status_User == 0 &&
                        ctrl.newFollowUp.followUp_Status_Provider == 1
                    ) {
                        /* Decline surgery appointments if provider scheduled any without consulting with user first */
                        const messageFeedback = await DashboardServices.declineUserSurgeryMessage(
                            ctrl.appointment
                        )
                        if (messageFeedback.data.status < 0) {
                            GlobalServices.showToastMsg(messageFeedback.data.message, 'ERROR')
                            $mdDialog.hide(answer)
                            return
                        }
                    }

                    let feedback
                    if (message.followUp_Status_Provider == null) {
                        feedback = await DashboardServices.userFollowUp(ctrl.newFollowUp)
                    } else {
                        feedback = await DashboardServices.userFollowUpUpdate(ctrl.newFollowUp)
                    }

                    if (feedback.data.status < 0) {
                        GlobalServices.showToastMsg(appointment.data.message, 'ERROR')
                        $mdDialog.hide(answer)
                        return
                    }

                    GlobalServices.showToastMsg(
                        'Your request has been submitted, please wait for the provider to confirm',
                        'SUCCESS'
                    )
                    $mdDialog.hide(answer)
                    return
                }

                ctrl.providerAnswer = async function(answer, is_invalid) {
                    if (is_invalid) {
                        GlobalServices.showToastMsg(
                            'The form is incomplete, please check all the fields',
                            'ERROR'
                        )
                        return
                    }
                    ctrl.newFollowUp.appointment_ID = ctrl.appointment.appointment_ID
                    ctrl.newFollowUp.followUp_Status_Provider = ctrl.newFollowUp
                        .followUp_Status_Provider
                        ? 1
                        : 0

                    const appointmeny_method = ctrl.newFollowUp.scheduleSurgery
                        ? ''
                        : ctrl.appointment.appointment_Method

                    ctrl.newAppointment = {
                        ...ctrl.newAppointment,
                        message_Sender: ctrl.appointment.provider_ID,
                        message_Receiver: ctrl.appointment.user_ID,
                        message_ServiceID: ctrl.appointment.service_ID,
                        current_Appointment: ctrl.appointment.appointment_ID,
                        message_appointmentMethod: appointmeny_method,
                        message_Skype: ctrl.appointment.appointment_SkypeUser,
                        message_WhatsApp: ctrl.appointment.appointment_WhatsAppUser,
                        message_ProviderWhatsApp: ctrl.appointment.appointment_WhatsApp,
                        message_ProviderSkype: ctrl.appointment.appointment_Skype,
                        appointment_Date: ctrl.message.appointment_Date,
                        appointment_Time: ctrl.message.appointment_Time,
                        message_Action: { status: 0 },
                    }

                    ctrl.newAppointment.message_Type = ''
                    if (ctrl.newFollowUp.scheduleConsultation) {
                        ctrl.newAppointment.message_Type = 'Follow Up Consultation'
                    } else if (ctrl.newFollowUp.scheduleSurgery) {
                        ctrl.newAppointment.message_Type = 'Procedure'
                    }

                    let message = {
                        message_Sender: ctrl.appointment.provider_ID,
                        message_Receiver: ctrl.appointment.user_ID,
                        service_ID: ctrl.appointment.service_ID,
                        related_Appointment: ctrl.appointment.appointment_ID,
                        current_Appointment: ctrl.appointment.appointment_ID,
                        message_appointmentMethod: appointmeny_method,
                    }

                    if (ctrl.newFollowUp.scheduleConsultation) {
                        message.message_Type = 'Consultation'
                    } else if (ctrl.newFollowUp.scheduleSurgery) {
                        message.message_Type = 'Procedure'
                    } else {
                        message.message_Type = ''
                    }

                    if (ctrl.followUp.length == 0) {
                        message.followUp_Status_User = null
                    } else {
                        message.followUp_Status_User = ctrl.followUp[0].followUp_Status_User ? 1 : 0
                    }

                    if (ctrl.newFollowUp.scheduleSurgery || ctrl.newFollowUp.scheduleConsultation) {
                        const created_appointments_result = await DashboardServices.createAppointment(
                            [ctrl.newAppointment]
                        )

                        if (created_appointments_result.data.status < 0) {
                            GlobalServices.showToastMsg(appointment.data.message, 'ERROR')
                        } else {
                            const { created_appointments } = created_appointments_result.data

                            const new_appointment_id = created_appointments[0].created_appointment
                            const new_cart_id = created_appointments[0].new_cart_id
                            message.related_Appointment = new_appointment_id
                            cartInfo.appointment_ID = new_appointment_id
                            cartInfo.cart_ID = new_cart_id
                            const message_Action = await GlobalServices.getServiceMessageTextFromStatus(
                                4
                            )
                            message.message_Action = message_Action
                            const new_message_data = await DashboardServices.createServiceMessage(
                                message
                            )
                            const { new_message_id, status } = new_message_data.data
                            if (status < 0) {
                                GlobalServices.showToastMsg(appointment.data.message, 'ERROR')
                                return
                            }
                            cartInfo.message_ID = new_message_id

                            await ShoppingCartServices.updateShoppingCart(
                                cartInfo,
                                ctrl.shoppingCart,
                                ctrl.shoppingCartOriginal,
                                ctrl.newAppointment,
                                ctrl.notes,
                                ctrl.total,
                                ctrl.directPriceChange,
                                true
                            )
                        }
                    }
                    let feedback
                    if (message.followUp_Status_User == null) {
                        feedback = await DashboardServices.providerFollowUp(ctrl.newFollowUp)
                    } else {
                        feedback = await DashboardServices.providerFollowUpUpdate(ctrl.newFollowUp)
                    }

                    if (feedback.data.status < 0) {
                        GlobalServices.showToastMsg(appointment.data.message, 'ERROR')
                        $mdDialog.hide(answer)
                        return
                    }
                    GlobalServices.showToastMsg(
                        'Your request has been submitted, please wait for the user to confirm',
                        'SUCCESS'
                    )
                    $mdDialog.hide(answer)
                    return
                }
                ctrl.hide = function() {
                    $mdDialog.hide()
                }
                ctrl.cancel = function() {
                    $mdDialog.cancel()
                }
            },
        }
    },
])
