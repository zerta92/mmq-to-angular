'use strict'

angular.module(`core.index`, []).factory(`IndexServices`, [
    `$http`,
    function($http) {
        return {
            getProcedures: function(search) {
                return $http.get(`/api/AutoCompleteProcedure/` + search)
            },
            getProceduresByCategoryId: function(search) {
                return $http.get(`/api/AutoCompleteProcedureByCategoryId/` + search)
            },
            getProceduresByCategoryIdV2: function(search) {
                return $http.get(`/api/AutoCompleteProcedureByCategoryIdV2/` + search)
            },
            getCategories: function(search) {
                return $http.get(`/api/AutoCompleteCategories/` + search)
            },
            getSubCategorisByMaincategory: function(search) {
                return $http.get(`/api/AutoCompleteSubCategories/` + search)
            },
            getMainCategories: function() {
                return $http.get(`/api/AutoCompleteMainCategories`)
            },
            getLocations: function(search) {
                return $http.get(`/api/AutoCompleteLocation/` + search)
            },
            getListCategories: function() {
                return $http.get(`/api/categories/main_categories`)
            },
            getCustomerPreferredLanguage: function() {
                return $http.get(`/api/getCustomerPreferredLanguage`)
            },
            setCustomerPreferredLanguage: function(lang) {
                return $http.get(`/api/setCustomerPreferredLanguage/` + lang)
            },
            sendContactInfo: function(contactName, contactEmail, contactPhone, information) {
                return $http.post(`/api/providers/sendGeneralInformationServices`, {
                    params: {
                        contactName_: contactName,
                        contactEmail_: contactEmail,
                        contactPhone_: contactPhone,
                        information_: information,
                    },
                })
            },
            getListCategories: function() {
                return $http.get(`/api/services/getListCategories`)
            },
            getRecaptchaKey: function() {
                return $http.get(`/api/getRecaptchaKey`)
            },
            getFeaturedClinics: function() {
                return $http.get(`/api/getFeaturedClinics`)
            },
        }
    },
])
