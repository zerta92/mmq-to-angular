'use strict'

angular.module(`core.list`, []).factory(`ListServices`, [
    `$http`,
    function($http) {
        return {
            findCategories: function() {
                return $http.get('/api/categories/retrieveCategories')
            },
            getListCategories: function() {
                return $http.get('/api/categories/main_categories')
            },
            getServicesByCategory: function(id) {
                return $http.get('/api/services/getServicesByCategory/' + id)
            },
            getProviderServicesGroupedByCategory: function(provider_ID) {
                return $http.post('/api/services/getProviderServicesGroupedByCategory', provider_ID)
            },
            findServicesByCategory: function(category) {
                return $http.get('/api/findServicesByCategory/' + category)
            },
            findServicesBySearchTerms: function(search_) {
                return $http.get('/api/findServicesBySearchTerms/' + search_)
            },
            getCategoriesListSearch: function(search) {
                return $http.get('/api/AutoCompleteCategories/' + search)
            },
            getCountriesListSearch: function() {
                return $http.get('/api/AutoCompleteCountries')
            },
            findProvider: function(providerId) {
                return $http.get('/api/findProvider/' + providerId)
            },
            findServiceByProvider: function(providerId, procedure, language) {
                return $http.get(
                    '/api/findServiceByProvider/' + providerId + '/' + procedure + '/' + language
                )
            },
            findIncludesByProcedure: function(procedureId) {
                return $http.get('/api/procedures/inlcludesByProcedureId/' + procedureId)
            },
            findAllServicesByProvider: function(providerId) {
                return $http.get('/api/findAllServicesByProvider/' + providerId)
            },
            createIncludeTraslationDetails: function(Data) {
                return $http.post('/api/includes/saveIncludeTextDetails', Data)
            },
            getUserLocation: function() {
                return $http.get('/api/getLocation')
            },
            requestAppointment: function(service, user) {
                return $http.post('/api/services-manager/requestAppointment', [service, user])
            },
            contactProvider: function(service, user) {
                return $http.post('/api/contactProvider', [service, user])
            },
            setUserService: function(service) {
                return $http.post('/api/customer/setUserService', service)
            },
            findServiceOptions: function(serviceId) {
                return $http.get('/api/findServiceOptions/' + serviceId)
            },
            findOptionItem: function(itemId) {
                return $http.get('/api/findOptionItem/' + itemId)
            },
            deleteSelectedServices: function(messages) {
                return $http.post('/api/services-manager/deleteSelectedServices', messages)
            },
            userDeleteSelectedServices: function(messages) {
                return $http.post('/api/services-manager/userDeleteSelectedServices', messages)
            },
            getHospitalAttachments: function(hospitalId) {
                return $http.post('/api/providers/getAttachmentsByProviderId', hospitalId)
            },
            getAttImgData: function(attId) {
                return $http.get('/api/providers/getAttDataById/' + attId)
            },
            getAttDefaultImgData: function() {
                return $http.get('/api/providers/getDefaultAttData/')
            },
            getAttServicesImgData: function(attId) {
                return $http.get('/api/services/getAttServicesDataById/' + attId)
            },
            getProviderByProviderId: function(provider_ID) {
                return $http.get('/api/providers/providerById/' + provider_ID)
            },
            getStaffByProviderId: function(provider_ID) {
                return $http.get('/api/providers/staffInfoByProviderId/' + provider_ID)
            },
            getAirbnbInfo: function(providerAdd) {
                return $http.get('/api/getAirbnbServices/' + providerAdd)
            },
            getStudiesListByStaffId: function(staffId) {
                return $http.get('/api/providers/getStudiesListByProviderId/' + staffId)
            },
            getLocations: function(search) {
                return $http.get('/api/AutoCompleteLocation/' + search)
            },
            getProcedures: function(search) {
                return $http.get('/api/AutoCompleteProcedure/' + search)
            },
            findServicesByCatID: function(catID) {
                return $http.get('/api/findServicesByCategory/' + catID)
            },

            createReview: function(reviewData) {
                return $http.post('/api/saveReviewData', reviewData)
            },

            findAverageReviewsByProviderId: function(providerId) {
                return $http.get('/api/findAverageByProviderId/' + providerId)
            },

            findAverageConsolidateReviewsByProviderId: function(providerId) {
                return $http.get('/api/findAverageConsolidateByProviderId/' + providerId)
            },
            findAllReviewsByProviderId: function(providerId) {
                return $http.get('/api/findAllReviewsByProviderId/' + providerId)
            },
            sendPaymentProcessEmail: function(data) {
                return $http.post('/api/sendPaymentProcessEmail', data)
            },
            getCustomerPreferredLanguage: function() {
                return $http.get('/api/getCustomerPreferredLanguage')
            },
            // setCustomerPreferredLanguage: function(lang) {
            //     return $http.get('/api/setCustomerPreferredLanguage/' + lang)
            // },
            getMyMedQuestInf0: function() {
                return $http.get('/api/dashboard/getMyMedQuestInfo')
            },
        }
    },
])
