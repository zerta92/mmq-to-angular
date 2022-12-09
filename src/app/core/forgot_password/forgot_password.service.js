'use strict'

angular.module(`core.forgotPassword`, []).factory(`ForgotPasswordServices`, [
    `$http`,
    function($http) {
        return {
            resetPasswordByUserName: function(forgotObj) {
                return $http.post('/api/resetPassword', forgotObj)
            },
            authenticateAccountPasswordReset: function(authObj) {
                return $http.post('/api/authenticateAccountPasswordReset', authObj)
            },
        }
    },
])
