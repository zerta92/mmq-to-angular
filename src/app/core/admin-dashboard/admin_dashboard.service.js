'use strict'

angular.module(`core.adminDashboard`, []).factory(`AdminDashboardServices`, [
    `$http`,
    function($http) {
        return {
            getCustomersActions: function() {
                return $http.post('/api/customer/getCustomersActions')
            },
        }
    },
])
