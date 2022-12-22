'use strict'

angular.module(`core.shoppingCart`, []).factory(`ShoppingCartServices`, [
    '$http',
    'GlobalServices',
    function($http, GlobalServices) {
        return {
            getCartById: function(data) {
                return $http.post('/api/getCartById', data)
            },
            createIncludeTraslationDetails: function(data) {
                return $http.post('/api/includes/saveIncludeTextDetails', data)
            },
            getProceduresByIncludeID: function(id) {
                return $http.get('/api/includes/proceduresByIncludeId/' + id)
            },
            getPriviliges: function(profileId) {
                return $http.get('/api/getDashboardPriviliges/' + profileId)
            },
            getUserService: function(service) {
                return $http.post('/api/customer/getUserService', service)
            },
            setUserService: function(service) {
                return $http.post('/api/customer/setUserService', service)
            },
            updateUserService: function(service) {
                return $http.post('/api/customer/updateUserService', service)
            },
            getItemParentOption: function(item) {
                return $http.get('/api/getItemParentOption/' + item)
            },
            getItemName: function(item) {
                return $http.get('/api/getItemName/' + item)
            },
            clearServiceOptions: function(data) {
                return $http.post('/api/clearServiceOptions/', data)
            },
            clearCart: function(data) {
                return $http.post('/api/clearCart/', data)
            },
            setCartID: function(cart) {
                return $http.post('/api/setCartID/', cart)
            },
            getCartID: function(appointment) {
                return $http.get('/api/getCartID/')
            },
            processCreditCard: function(data) {
                return $http.post('/api/processCreditCard', data)
            },
            paypalAuthorizationAndCapture: function(data) {
                return $http.post('/api/paypalAuthorizationAndCapture', data)
            },
            paypalAuthorizationAndCaptureContinued: function(data) {
                return $http.post('/api/paypalAuthorizationAndCaptureContinued', data)
            },
            setTransaction: function(cart) {
                return $http.post('/api/setTransaction/', cart)
            },
            getTransaction: function(appointment) {
                return $http.get('/api/getTransaction/')
            },
            getMessageByAppointmentId: function(id, profileType) {
                return $http.get('/api/getMessageByAppointmentId/' + id + '/' + profileType)
            },
            userConfirmSelected: function(messages) {
                return $http.post('/api/services-manager/userConfirmSelectedServices', messages)
            },
            userConfirmAppointment: function(aptmntData) {
                return $http.post('/api/services-manager/userConfirmAppointment', aptmntData)
            },
            notifyProviderOfAppointmentPayment: function(aptmntData) {
                return $http.post('/api/notifyProviderOfAppointmentPayment', aptmntData)
            },
            userPay: function(message) {
                return $http.post('/api/services-manager/userPay', message)
            },
            userRecordPay: function(message) {
                return $http.post('/api/services-manager/userRecordPay', message)
            },
            sendPaymentProcessEmail: function(data) {
                return $http.post('/api/sendPaymentProcessEmail', data)
            },
            setMessageForPayment: function(message) {
                return $http.post('/api/setMessageForPayment/', message)
            },
            getAppointmentById: function(id) {
                return $http.get('/api/getAppointmentById/' + id)
            },
            setAppointmentPaidStatus: function(aptmntStatusData) {
                return $http.post('/api/setAppointmentPaidStatus', aptmntStatusData)
            },
            getUserCategories: function(id) {
                return $http.get('/api/services/getUserCategories/' + id)
            },
            getServicesByCategory: function(id) {
                return $http.get('/api/services/getServicesByCategory/' + id)
            },
            getUserSubCategories: function(id) {
                return $http.get('/api/categories/userCategories/' + id)
            },
            updateNotes: function(notes) {
                return $http.post('/api/updateNotes', notes)
            },
            updateShoppingCart: async function(
                cartInfo,
                shoppingCart,
                shoppingCartOriginal,
                appointment,
                notes,
                total,
                directPriceChange,
                is_follow_up
            ) {
                const shoppingCartService = this
                let cartDataObj = {
                    user_ID: cartInfo.user_ID,
                    provider_ID: cartInfo.provider_ID,
                    cart_ID: cartInfo.cart_ID,
                }

                if (!is_follow_up) {
                    const [clearConfirmation, paidUpdateConfirmation] = await Promise.all([
                        shoppingCartService.clearCart(cartDataObj),
                        shoppingCartService.setAppointmentPaidStatus({
                            id: appointment.appointment_ID,
                            status: 0,
                        }),
                    ])

                    if (clearConfirmation.data.status < 0) {
                        GlobalServices.showToastMsg(clearConfirmation.data.message, 'ERROR')
                        console.log(clearConfirmation.data.message)
                        return
                    }
                    if (paidUpdateConfirmation.data.status < 0) {
                        GlobalServices.showToastMsg(clearConfirmation.data.message, 'ERROR')
                        return
                    }
                }
                const managed_services = await Promise.all(
                    Object.keys(shoppingCart).map(async function(service) {
                        let userServiceUpdate = {
                            user_ID: cartInfo.user_ID,
                            provider_ID: cartInfo.provider_ID,
                            service_ID: service,
                            cart_ID: cartInfo.cart_ID,
                            options: shoppingCart[service][0].options,
                            appointment_ID: cartInfo.appointment_ID,
                            cart_Quantity: shoppingCart[service][0].cart_Quantity,
                            cart_Cost: shoppingCart[service][0].cart_Cost,
                            cart_PriceFactor: total.factorApplied,
                            service_consultationCost: total.consultation_Cost,
                            cart_providerSetPrice: directPriceChange[service] ? 1 : 0,
                            message_ID: cartInfo.message_ID,
                            notes: notes,
                            brand_ID: shoppingCart[service][0].brand_ID,
                        }

                        const service_managed = await shoppingCartService.manageOptions(
                            shoppingCart,
                            shoppingCartOriginal,
                            service,
                            userServiceUpdate
                        )
                        return service_managed
                    })
                )

                if (managed_services.indexOf('error') == -1) {
                    GlobalServices.showToastMsg('Cart Updated', 'SUCCESS')
                } else {
                    //if(!cartRecovered){
                    //	cartRecovery();
                    //}
                }
            },
            manageOptions: async function(
                shoppingCart,
                shoppingCartOriginal,
                service,
                userServiceUpdate
            ) {
                const shoppingCartService = this
                for (const service_option in shoppingCart[service]) {
                    if (userServiceUpdate.options) {
                        userServiceUpdate.options = userServiceUpdate.options.map(i => {
                            return { item_ID: i.item_ID, item_price: i.item_price }
                        })
                    } else {
                        userServiceUpdate.options = []
                    }

                    userServiceUpdate.option = 0
                    userServiceUpdate.cart_realPrice = shoppingCartOriginal[service]
                        ? shoppingCartOriginal[service][0].cart_realPrice *
                          shoppingCartOriginal[service][0].cart_Quantity
                        : shoppingCart[service][0].cart_realPrice *
                          shoppingCart[service][0].cart_Quantity

                    const setService = await shoppingCartService.setUserService(userServiceUpdate)

                    if (setService.data.status < 0) {
                        GlobalServices.showToastMsg(setService.data.message, 'ERROR')
                        return 'error'
                    } else {
                        return 'success'
                    }
                }
            },
        }
    },
])
