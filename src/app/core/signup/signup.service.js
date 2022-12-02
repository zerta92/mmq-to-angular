'use strict';

angular
    .module('core.signup', [])
    .factory('SignupServices', [
        '$http',
        function($http) {
            return {
                confirmAccount: function(confirmationObj) {
                    return $http.post('/api/confirmAccount', confirmationObj)
                },
                userSignup: function(userObj) {
                    return $http.post('/api/userSignup', userObj)
                },
                providerSignup: function(providerObj) {
                    return $http.post('/api/providerSignup', providerObj)
                },
                getListCategories: function() {
                    return $http.get('/api/categories/main_categories')
                },
                getMyMedQuestInf0: function() {
                    return $http.get('/api/dashboard/getMyMedQuestInfo')
                },
                validateUserName: function(forgotObj) {
                    return $http.post('/api/providers/validateUserName', forgotObj)
                },
                resetPasswordByUserName: function(forgotObj) {
                    return $http.post('/api/resetPassword', forgotObj)
                },
                authenticateAccountPasswordReset: function(authObj) {
                    return $http.post('/api/authenticateAccountPasswordReset', authObj)
                },
            }
        },
    ])
