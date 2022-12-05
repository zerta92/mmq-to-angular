'use strict'

angular.module(`core.procedureContent`, []).factory(`ProcedureContentServices`, [
    `$http`,
    function($http) {
        return {
            getMainCategories: function() {
                return $http.get('/api/categories/main_categories')
            },
            getProcedureWithCategory: function(id) {
                return $http.get('/api/getProcedureWithCategory/' + id)
            },
            findRelatedProceduresByCategoryID: function(id) {
                return $http.get('/api/findRelatedProceduresByCategoryID/' + id)
            },
            getMyMedQuestInf0: function() {
                return $http.get('/api/dashboard/getMyMedQuestInfo')
            },
        }
    },
])
