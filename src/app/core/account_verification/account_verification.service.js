'use strict'

angular.module(`core.accountVerification`, []).factory(`AccountVerificationServices`, [
    `$http`,
    function($http) {
        return {
            confirmAccount: function(confirmationObj) {
                return $http.post('/api/confirmAccount', confirmationObj)
            },
        }
    },
])
