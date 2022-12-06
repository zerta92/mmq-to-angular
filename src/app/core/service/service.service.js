'use strict'

angular.module(`core.service`, []).factory(`ServiceServices`, [
    `$http`,
    function($http) {
        return {
            getOptions: function() {
                return $http.get('/api/options')
            },
            getOptionsByCategoryAndProcedure: function(id) {
                return $http.get('/api/services/getOptionsByCategoryAndProcedure/' + id)
            },
            findOptionsByProcedureId: function(id) {
                return $http.get('/api/services/findOptionsByProcedureId/' + id)
            },
            getCategorieByProcedureId: function(id) {
                return $http.get('/api/categories/categorieByProcedureId/' + id)
            },
            getProceduresByCategoryID: function(id) {
                return $http.get('/api/services/getProceduresByCategoryID/' + id)
            },
            getMainCategories: function() {
                return $http.get('/api/categories/main_categoriesV2')
            },
            getServiceByServicesId: function(id) {
                return $http.get('/api/services/getServiceByServiceId/' + id)
            },
            getServicesByProvider: function(id) {
                return $http.get('/api/services/getServicesByProvider/' + id)
            },
            findServicesByProcedureId: function(obj) {
                return $http.post('/api/services/findServicesByProcedureId', obj)
            },
            getUserCategories: function(id) {
                return $http.get('/api/services/getUserCategories/' + id)
            },
            getServicesByCategory: function(id) {
                return $http.get('/api/services/getServicesByCategory/' + id)
            },
            disableService: function(id) {
                return $http.delete('/api/services/disableService/' + id)
            },
            deleteService: function(id) {
                return $http.delete('/api/services/deleteService/' + id)
            },
            deleteOptionsServices: function(id) {
                return $http.delete('/api/services/deleteOptionsServices/' + id)
            },
            getProcedureByProcedureID: function(id) {
                return $http.get('/api/services/getProcedureByProcedureID/' + id)
            },
            getSubCategories: function(id) {
                return $http.get('/api/categories/' + id)
            },
            getUserSubCategories: function(id) {
                return $http.get('/api/categories/userCategories/' + id)
            },
            createServices: function(todoData) {
                return $http.post('/api/services/createServices', todoData)
            },
            updateServices: function(todoData) {
                return $http.post('/api/services/updateService', todoData)
            },
            createOptionServices: function(todoData) {
                return $http.post('/api/services/createOptionServices', todoData)
            },
            createMultipleOptionServices: function(todoData) {
                return $http.post('/api/services/createMultipleOptionServices', todoData)
            },
            getItemsByOptionIds: function(option_ids) {
                return $http.post('/api/options/getItemsByOptionIds', option_ids)
            },
            getOptionsIncludeExcludeByOptionId: function(optionId) {
                return $http.get('/api/options/getOptionsIncludeExcludeByOptionId/' + optionId)
            },
            getOptionServicesByServiceAndOptionId: function(ids) {
                return $http.post('/api/options/getOptionServicesByServiceAndOptionId', ids)
            },
            getAllDocumentsRequired: function() {
                return $http.get('/api/services/getAllDocumentsRequired')
            },
            createDocumentServices: function(documentServiceObj) {
                return $http.post('/api/services/createDocumentServices', documentServiceObj)
            },
            createMultipleDocumentServices: function(documentServiceObj) {
                return $http.post(
                    '/api/services/createMultipleDocumentServices',
                    documentServiceObj
                )
            },
            deleteDocumentServices: function(id) {
                return $http.delete('/api/services/deleteDocumentServices/' + id)
            },
            getAllDocumentsRequiredByServiceId: function(id) {
                return $http.get('/api/services/getAllDocumentsRequiredByServiceId/' + id)
            },
            getCategoryBiCId: function(categoryId) {
                return $http.get('/api/categories/categoryById/' + categoryId)
            },
            getProviderShowAlertFlag: function(id) {
                return $http.get('/api/services/getProviderShowAlertFlag/' + id)
            },
            updateShowAlertFlagByProviderId: function(id) {
                return $http.post('/api/updateShowAlertFlagByProviderId/' + id)
            },
            checkProviderServices: function(provider_id) {
                return $http.get('/api/services/checkProviderServices/' + provider_id)
            },
        }
    },
])
