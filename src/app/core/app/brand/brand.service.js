'use strict'

angular.module(`core.brand`, []).factory(`BrandServices`, [
    `$http`,
    function($http) {
        return {
            getAllProcedureBrands: function(procedure_ID) {
                return $http.post('/api/procedures/getAllProcedureBrands', procedure_ID)
            },
            getAllProviderBrands: function(provider_ID) {
                return $http.post('/api/procedures/getAllProviderBrands', provider_ID)
            },
            getAllBrands: function() {
                return $http.post('/api/procedures/getAllBrands')
            },
            getAllCurrentProcedureBrands: function(procedureObj) {
                return $http.post('/api/procedures/getAllCurrentProcedureBrands', procedureObj)
            },
            getSelectedProcedureBrands: function(service_ID) {
                return $http.post('/api/services/getSelectedProcedureBrands', service_ID)
            },
            updateBrand: function(brandObj) {
                return $http.post('/api/procedures/updateBrand', brandObj)
            },
            createBrand: function(brandObj) {
                return $http.post('/api/procedures/createBrand', brandObj)
            },
            updateBrandStatus: function(brandObj) {
                return $http.post('/api/procedures/updateBrandStatus', brandObj)
            },
            deleteBrand: function(brandObj) {
                return $http.post('/api/procedures/deleteBrand', brandObj)
            },
            createProcedureBrandRel: function(brandObj) {
                return $http.post('/api/procedures/createProcedureBrandRel', brandObj)
            },
            deleteProcedureBrandRel: function(brandObj) {
                return $http.post('/api/procedures/deleteProcedureBrandRel', brandObj)
            },
        }
    },
])
