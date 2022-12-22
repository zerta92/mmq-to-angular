'use strict'

angular.module(`core.serviceManager`, []).factory(`ServiceManagerServices`, [
    `$http`,
    '$mdDialog',
    function($http, $mdDialog) {
        return {
            userLogin: function(userObj) {
                return $http.post('/api/userLogin', userObj)
            },
            create: function(categoriesObj) {
                return $http.post('/api/categories/saveCategories', categoriesObj)
            },
            getPriviliges: function(profileId) {
                return $http.get('/api/getMessagesPriviliges/' + profileId)
            },
            getProviderServicesMessages: function(user) {
                return $http.post('/api/services-manager/getProviderServicesMessages', user)
            },
            getUserServicesMessages: function(user) {
                return $http.post('/api/services-manager/getUserServicesMessages', user)
            },
            getServiceByServiceId: function(id) {
                return $http.get('/api/services/getServiceByServiceId/' + id)
            },
            getProcedureByProcedureID: function(id) {
                return $http.get('/api/services/getProcedureByProcedureID/' + id)
            },
            confirmSelected: function(messages) {
                return $http.post('/api/services-manager/confirmSelectedServices', messages)
            },
            cancelSelected: function(messages) {
                return $http.post('/api/services-manager/cancelSelectedServices', messages)
            },
            userCancelSelected: function(messages) {
                return $http.post('/api/services-manager/userCancelSelectedServices', messages)
            },
            userConfirmSelected: function(messages) {
                return $http.post('/api/services-manager/userConfirmSelectedServices', messages)
            },
            deleteSelected: function(messages) {
                return $http.post('/api/services-manager/deleteSelectedServices', messages)
            },
            deleteUserOptions: function(userService) {
                return $http.post('/api/services-manager/deleteUserOptions', userService)
            },
            userDeleteUserOptions: function(userService) {
                return $http.post('/api/services-manager/userDeleteUserOptions', userService)
            },
            userDeleteSelected: function(messages) {
                return $http.post('/api/services-manager/userDeleteSelectedServices', messages)
            },
            notifyUsersConfirm: function(messages) {
                return $http.post('/api/services-manager/notifyUsersOfApprovedServices', messages)
            },
            notifyUsersDecline: function(messages) {
                return $http.post('/api/services-manager/notifyUsersOfDeclinedServices', messages)
            },
            notifyProvidersDecline: function(messages) {
                return $http.post(
                    '/api/services-manager/notifyProvidersOfDeclinedServices',
                    messages
                )
            },
            notifyProvidersAccept: function(messages) {
                return $http.post(
                    '/api/services-manager/notifyProvidersOfApprovedServices',
                    messages
                )
            },
            createAppointment: function(aptmntData) {
                return $http.post('/api/services-manager/createAppointment', aptmntData)
            },
            deleteAppointment: function(aptmntData) {
                return $http.post('/api/services-manager/deleteAppointment', aptmntData)
            },
            cancelAppointment: function(aptmntData) {
                return $http.post('/api/services-manager/cancelAppointment', aptmntData)
            },
            reSchedule: function(appointment) {
                return $http.post('/api/services-manager/reSchedule', appointment)
            },
            notifyUserOfReSchedule: function(appointment) {
                return $http.post('/api/services-manager/notifyUserOfReSchedule', appointment)
            },
            userConfirmAppointment: function(aptmntData) {
                return $http.post('/api/services-manager/userConfirmAppointment', aptmntData)
            },
            userGetAppointmentFromMessage: function(message) {
                return $http.post('/api/services-manager/userGetAppointmentFromMessage', message)
            },
            userFollowUpUpdate: function(feedback) {
                return $http.post('/api/dashboard/userFollowUpUpdate', feedback)
            },
            userFollowUpUpdateMessage: function(feedback) {
                return $http.post('/api/dashboard/userFollowUpUpdateMessage', feedback)
            },
            declineUserSurgeryMessage: function(appointment) {
                return $http.post('/api/services-manager/declineUserSurgeryMessage', appointment)
            },
            setPreviousPage: function(url) {
                return $http.post('/api/setPreviousPage', url)
            },
            getPreviousPage: function() {
                return $http.get('/api/getPreviousPage')
            },
            getAppointmentFromUserMessage: function(aptmntData) {
                return $http.post('/api/services-manager/getAppointmentFromUserMessage', aptmntData)
            },
            getAppointmentFromProviderMessage: function(aptmntData) {
                return $http.post(
                    '/api/services-manager/getAppointmentFromProviderMessage',
                    aptmntData
                )
            },
            getProviderMessageFromUserMessageID: function(message) {
                return $http.post(
                    '/api/services-manager/getProviderMessageFromUserMessageID',
                    message
                )
            },
            getUserMessageFromProviderMessageID: function(message) {
                return $http.post(
                    '/api/services-manager/getUserMessageFromProviderMessageID',
                    message
                )
            },
            userPay: function(message) {
                return $http.post('/api/services-manager/userPay', message)
            },
            setCartID: function(cart) {
                return $http.post('/api/setCartID/', cart)
            },
            getCartIDByAppointmentID: function(appointment) {
                return $http.post('/api/getCartIDByAppointmentID/', appointment)
            },
            showCancelServiceWarning: function(event, profileType) {
                return new Promise(async function(resolve, reject) {
                    var confirm = $mdDialog
                        .confirm()
                        .title('Are you sure to cancel the service?')
                        .textContent(
                            `Once cancelled you will not be able to accept again and the ${profileType} will have to send another request.`
                        )
                        .ariaLabel('Cancel Service')
                        .targetEvent(event)
                        .ok('Yes')
                        .cancel('No')
                    $mdDialog.show(confirm).then(
                        function() {
                            resolve(true)
                        },
                        function() {
                            resolve(false)
                        }
                    )
                })
            },
        }
    },
])
