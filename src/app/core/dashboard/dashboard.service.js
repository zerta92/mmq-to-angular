'use strict'

angular.module(`core.dashboard`, []).factory(`DashboardServices`, [
    `$http`,
    function($http) {
        return {
            getCategoriesByUserProfile: function(id) {
                return $http.get('/api/dashboard/getAllCategoriesByUserProfile/' + id)
            },
            getAllServicesByCategory: function(id) {
                return $http.post('/api/dashboard/getAllServicesByCategory')
            },
            getProceduresByCategoryAndProvider: function(id) {
                return $http.get('/api/getServicesByCategory/' + id)
            },
            getPriviliges: function(profileId) {
                return $http.get('/api/getDashboardPriviliges/' + profileId)
            },
            getProceduresTop10: function() {
                return $http.get('/api/dashboard/getProceduresTop10')
            },
            loadAllUsers: function() {
                return $http.get('/api/dashboard/loadAllUsers')
            },
            loadAllProviders: function() {
                return $http.get('/api/dashboard/loadAllProviders')
            },
            getProfileByProfileId: function(profileId) {
                return $http.get('/api/dashboard/getProfileByProfileId/' + profileId)
            },
            getDataProviderInforDashBoard: function(profileId) {
                return $http.get(
                    '/api/dashboard/getDataReportProviderServicesForAcceptingByProviderId/' +
                        profileId
                )
            },
            getDataUserInforDashBoard: function(profileId) {
                return $http.get(
                    '/api/dashboard/getDataReportUserConsultationNotificationByUserId/' + profileId
                )
            },
            getDataUserInforHiredServicesDashBoard: function(userId) {
                return $http.get('/api/dashboard/getDataReportHiredServicesByUserId/' + userId)
            },
            getUserDataById: function(userId) {
                return $http.get('/api/dashboard/getUserDataByUserId/' + userId)
            },
            getProviderDataById: function(providerId) {
                return $http.get('/api/dashboard/getProviderByProviderId/' + providerId)
            },
            getPendingAppoinments: function(providerId, load_demo) {
                if (load_demo) {
                    console.log('Loading demo data')
                    return $http.get('/api/dashboard/getDemoAppoinments')
                }
                return $http.get('/api/dashboard/getPendingAppoinments/' + providerId)
            },
            getUserAppoinments: function(providerId) {
                return $http.get('/api/dashboard/getUserAppoinments/' + providerId)
            },
            getOptionsInfoByServicesId: function(providerId) {
                return $http.get('/api/dashboard/getOptionsInformationBySvId/' + providerId)
            },
            createServiceMessage: function(message) {
                return $http.post('/api/services-manager/createServiceMessage', message)
            },
            createChangeServiceMessage: function(message) {
                return $http.post('/api/services-manager/createChangeServiceMessage', message)
            },
            getConsultationFeedback: function(appointmentID) {
                return $http.get('/api/dashboard/getConsultationFeedback/' + appointmentID)
            },
            userFollowUp: function(feedback) {
                return $http.post('/api/dashboard/userFollowUp', feedback)
            },
            providerFollowUp: function(feedback) {
                return $http.post('/api/dashboard/providerFollowUp', feedback)
            },
            userFollowUpUpdate: function(feedback) {
                return $http.post('/api/dashboard/userFollowUpUpdate', feedback)
            },
            userFollowUpUpdateMessage: function(feedback) {
                return $http.post('/api/dashboard/userFollowUpUpdateMessage', feedback)
            },
            providerFollowUpUpdate: function(feedback) {
                return $http.post('/api/dashboard/providerFollowUpUpdate', feedback)
            },
            declineUserSurgeryMessage: function(appointment) {
                return $http.post('/api/services-manager/declineUserSurgeryMessage', appointment)
            },
            createAppointment: function(aptmntData) {
                return $http.post('/api/services-manager/createAppointment', aptmntData)
            },
            userConfirmSelected: function(messages) {
                return $http.post('/api/services-manager/userConfirmSelectedServices', messages)
            },
            userConfirmAppointment: function(aptmntData) {
                return $http.post('/api/services-manager/userConfirmAppointment', aptmntData)
            },
            startChatWithUser: function(chat) {
                return $http.post('/api/startChatWithUser', chat)
            },
            startChatWithProvider: function(chat) {
                return $http.post('/api/startChatWithProvider', chat)
            },
            reSchedule: function(appointment) {
                return $http.post('/api/services-manager/reSchedule', appointment)
            },
            notifyUserOfReSchedule: function(appointment) {
                return $http.post('/api/services-manager/notifyUserOfReSchedule', appointment)
            },
            notifyProviderOfReSchedule: function(appointment) {
                return $http.post('/api/services-manager/notifyProviderOfReSchedule', appointment)
            },
            getAllUserMessages: function(user) {
                return $http.post('/api/getAllUserMessages', user)
            },
            findServiceOptions: function(serviceId) {
                return $http.get('/api/findServiceOptions/' + serviceId)
            },
            findOptionItem: function(itemId) {
                return $http.get('/api/findOptionItem/' + itemId)
            },
            setUserService: function(service) {
                return $http.post('/api/customer/setUserService', service)
            },
            updateUserService: function(service) {
                return $http.post('/api/customer/updateUserService', service)
            },
            getUserService: function(service) {
                return $http.post('/api/customer/getUserService', service)
            },
            getAllDocumentsRequiredByServiceId: function(id) {
                return $http.get('/api/services/getAllDocumentsRequiredByServiceId/' + id)
            },
            findRequiredDocumentsByProviderID: function(providerObj) {
                return $http.post('/api/documents/findRequiredDocumentsByProviderID', providerObj)
            },
            emailDocumentRequest: function(docs) {
                return $http.post('/api/documents/emailDocumentRequest/', docs)
            },

            getMainCategories: function() {
                return $http.get('/api/categories/main_categories')
            },
            getUserCategories: function(id) {
                return $http.get('/api/services/getUserCategories/' + id)
            },
            getSubCategories: function(id) {
                return $http.get('/api/categories/' + id)
            },
            getProceduresByCategoryID: function(id) {
                return $http.get('/api/services/getProceduresByCategoryID/' + id)
            },
            getCartIDByAppointmentID: function(appointment) {
                return $http.post('/api/getCartIDByAppointmentID/', appointment)
            },
            getAllAppointmentServices: function(appointment, load_demo) {
                if (load_demo) {
                    console.log('Loading demo data')
                    return $http.get('/api/dashboard/getDemoCartAppointmentServices')
                }
                return $http.post('/api/customer/getAllAppointmentServices/', appointment)
            },
            setCartID: function(cart) {
                return $http.post('/api/setCartID/', cart)
            },
            getCartID: function(appointment) {
                return $http.get('/api/getCartID/')
            },
            getCartById: function(data) {
                return $http.post('/api/getCartById', data)
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
            userPay: function(message) {
                return $http.post('/api/services-manager/userPay', message)
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
        }
    },
])
