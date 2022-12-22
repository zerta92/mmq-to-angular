'use strict'

angular.module(`core.documents`, []).factory(`DocumentsServices`, [
    `$http`,
    function($http) {
        return {
            createDocument: function(documentData) {
                return $http.post('/api/documents/saveDocument', documentData)
            },
            updateDocument: function(documentData) {
                return $http.post('/api/documents/updateDocument', documentData)
            },
            updateUserDocumentStatus: function(documentData) {
                return $http.post('/api/documents/updateUserDocumentStatus', documentData)
            },
            updateRequiredDocumentStatus: function(documentData) {
                return $http.post('/api/documents/updateRequiredDocumentStatus', documentData)
            },
            saveUserDocuments: function(documentData) {
                return $http.post('/api/documents/saveUserDocuments', documentData)
            },
            deleteDocumentByDocumentId: function(docDelete) {
                return $http.post('/api/documents/deleteDocumentByDocumentId/', docDelete)
            },
            deleteTraslateByTraslateId: function(id) {
                return $http.delete('/api/deleteTraslateByTraslateId/' + id)
            },
            findDocuments: function() {
                return $http.get('/api/documents/findDocuments')
            },
            findDocumentsByUserID: function(userData) {
                return $http.post('/api/documents/findDocumentsByUserID', userData)
            },
            findDocumentsByAppointmentID: function(userData) {
                return $http.post('/api/documents/findDocumentsByAppointmentID', userData)
            },
            findRequiredDocumentsByProviderID: function(providerObj) {
                return $http.post('/api/documents/findRequiredDocumentsByProviderID', providerObj)
            },
            getDocumentsByDocumentId: function(documentData) {
                return $http.post('/api/documents/findDocumentsById', documentData)
            },
            getUserServicesAndRequiredDocuments: function(userData) {
                return $http.post('/api/documents/getUserServicesAndRequiredDocuments', userData)
            },
            getTranslationTypesByTextId: function(id) {
                return $http.get('/api/options/getTranslationTypesByTextId/' + id)
            },
            findDocumentTranslationTypes: function(id) {
                return $http.get('/api/documents/findDocumentTranslationTypes/' + id)
            },
            getProfileByProfileId: function(profileId) {
                return $http.get('/api/dashboard/getProfileByProfileId/' + profileId)
            },
            getProviderInfoByUserServices: function(userId) {
                return $http.get('/api/findProviderinfoByUserServices/' + userId)
            },
        }
    },
])
