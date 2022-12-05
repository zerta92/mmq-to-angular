'use strict'

angular.module(`core.login`, []).factory(`LoginServices`, [
    `$http`,
    function($http) {
        return {
            userLogin: function(userObj) {
                return $http.post('/api/userLogin', userObj)
            },
            create: function(categoriesObj) {
                return $http.post('/api/categories/saveCategories', categoriesObj)
            },
            getUserProfile: function(token) {
                return $http.get('/api/getProfile/' + token)
            },
            getUserMenu: function() {
                return $http.get('/api/customer/getMenuPages')
            },
            getAllProviderMessages: function(user) {
                return $http.post('/api/getAllProviderMessages', user)
            },
            getAllUserMessages: function(user) {
                return $http.post('/api/getAllUserMessages', user)
            },
            getUserAppointmentsDiff: function(userId) {
                return $http.get('/api/dashboard/getUserAppointmentsDif/' + userId)
            },
            getUserStaffApproval: function(key) {
                return $http.post('/api/customer/staffUrlApproval', key)
            },
            getRequestForChangePasswd: function(email, type, id, username) {
                return $http.get(
                    '/api/changePassWdUser/' + email + '/' + type + '/' + id + '/' + username
                )
            },
            updateType1Information: function(profileInfo) {
                return $http.post('/api/updateProfileInfoType1', profileInfo)
            },
            updateType2Information: function(profileInfo) {
                return $http.post('/api/updateProfileInfoType2', profileInfo)
            },
            setCustomerPreferredLanguage: function(lang) {
                return $http.get('/api/setCustomerPreferredLanguage/' + lang)
            },
            validateUserName: function(forgotObj) {
                return $http.post('/api/providers/validateUserNameGetId', forgotObj)
            },
        }
    },
])
