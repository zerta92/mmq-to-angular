import _ from 'lodash'

angular.module('servicesSearchDropdownModule').component('servicesSearchDropdown', {
    templateUrl:  './app/components/services-search-dropdown/services_search_dropdown.template.html',
    bindings: {},
    controller: function ServiceSearchDropdownController($window, GlobalServices) {
        var ctrl = this

        this.$onInit = function() {}

        ctrl.selectedProcedureItem = { procedures: '' }
        ctrl.selectedLocationItem = { locations: '' }

        function getUrlParams() {
            if (
                window.location.href.includes('procedure') &&
                window.location.href.includes('location')
            ) {
                var urlParam = window.location.href.substring(
                    window.location.href.indexOf('procedure'),
                    window.location.href.length
                )
                var urlParamLocation = window.location.href.substring(
                    window.location.href.indexOf('location'),
                    window.location.href.length
                )
                var urlParamCategory = window.location.href.substring(
                    window.location.href.indexOf('category'),
                    window.location.href.length
                )
                var urlParamSpeciality = window.location.href.substring(
                    window.location.href.indexOf('speciality'),
                    window.location.href.length
                )
                var urlParamFreeDrescription = window.location.href.substring(
                    window.location.href.indexOf('country'),
                    window.location.href.length
                )

                urlParam = urlParam.substring(urlParam.indexOf('=') + 1, urlParam.indexOf('&')) //procedure
                urlParam = urlParam
                    .replace(/%20/g, ' ')
                    .replace(/\//g, '')
                    .replace(/\\/g, '')
                // ctrl.procedureSearch = urlParam == '0' ? 0 : urlParam

                urlParamLocation = urlParamLocation.substring(
                    urlParamLocation.indexOf('=') + 1,
                    urlParamLocation.indexOf('&')
                ) //location
                urlParamLocation = urlParamLocation
                    .replace(/%20/g, '')
                    .replace(/\//g, '')
                    .replace(/\\/g, '')

                urlParamCategory = urlParamCategory.substring(
                    urlParamCategory.indexOf('=') + 1,
                    urlParamCategory.indexOf('&')
                ) //category
                urlParamCategory = urlParamCategory
                    .replace(/%20/g, '')
                    .replace(/\//g, '')
                    .replace(/\\/g, '')

                urlParamSpeciality = urlParamSpeciality.substring(
                    urlParamSpeciality.indexOf('=') + 1,
                    urlParamSpeciality.indexOf('&')
                ) //Speciality
                urlParamSpeciality = urlParamSpeciality
                    .replace(/%20/g, '')
                    .replace(/\//g, '')
                    .replace(/\\/g, '')

                urlParamFreeDrescription = urlParamFreeDrescription.substring(
                    urlParamFreeDrescription.indexOf('=') + 1,
                    urlParamFreeDrescription.length
                ) //Speciality
                urlParamFreeDrescription = urlParamFreeDrescription
                    .replace(/\//g, '')
                    .replace(/\\/g, '')

                const searchObj = {
                    procedureId: urlParam,
                    location: urlParamLocation,
                    categoryId: urlParamCategory ?? 0,
                    specialityId: urlParamSpeciality ?? 0,
                    country:
                        urlParamFreeDrescription.length == 0
                            ? 'undefined'
                            : urlParamFreeDrescription,
                }

                ctrl.categorySearch = urlParamCategory

                return searchObj
            }
        }

        ctrl.searchObj = getUrlParams()

        // ctrl.getLocationMatches = function(locationSearch) {
        //     console.log(locationSearch)
        //     return new Promise(function(resolve, reject) {
        //         const resultList = []
        //         GlobalServices.getLocations(locationSearch).then(function(autocompleteResult) {
        //             if (autocompleteResult.data[0].length != 0) {
        //                 resultList.push({
        //                     label:
        //                         autocompleteResult.data[0][0].provider_City +
        //                             ', ' +
        //                             autocompleteResult.data[0][0].provider_State ||
        //                         autocompleteResult.data[0][0].provider_Country,
        //                     value:
        //                         autocompleteResult.data[0][0].provider_City +
        //                             ', ' +
        //                             autocompleteResult.data[0][0].provider_State ||
        //                         autocompleteResult.data[0][0].provider_Country,
        //                 })
        //             }
        //             // else if (autocompleteResult.data[1].length != 0) {
        //             //     resultList.push({
        //             //         label: autocompleteResult.data[1][0].provider_Country,
        //             //         value: autocompleteResult.data[1][0].provider_Country,
        //             //     })
        //             // }
        //             resolve(resultList)
        //         })
        //     }).then(function(resultList1) {
        //         return resultList1
        //     })
        // }
        ;(ctrl.getLocationsAll = function() {
            return new Promise(function(resolve, reject) {
                let resultList = []
                resultList.push({ label: 'All', value: -1 })
                GlobalServices.getLocations('ALL').then(function(allLocations) {
                    if (allLocations.data['cities'].length != 0) {
                        allLocations.data['cities'].forEach(location => {
                            resultList.push({
                                label:
                                    _.startCase(_.toLower(location.provider_City)).trim() +
                                    ', ' +
                                    _.startCase(_.toLower(location.provider_State.trim())),
                                value:
                                    _.startCase(_.toLower(location.provider_City)).trim() +
                                    ', ' +
                                    _.startCase(_.toLower(location.provider_State.trim())),
                                flag: _.toLower(location.provider_Country),
                            })
                        })

                        resultList = _.uniqBy(resultList, location => {
                            return location.label.toLowerCase().trim()
                        })
                    }
          
                    ctrl.selectedLocationItem.locations = resultList.find(x => {
                        if (!ctrl.searchObj) {
                            return
                        }
                        const search_location = x.label.replace(/\s/g, '')

                        return search_location === decodeURIComponent(ctrl.searchObj.location)
                    })
                    resolve(
                        resultList.map(location => {
                            return location
                        })
                    )
                })
            }).then(function(resultList1) {
                ctrl.locationsList = _.sortBy(resultList1, ['flag', 'label'])
            })
        })()

        ctrl.querySearchLocations = function(query) {
            var results = query
                ? ctrl.locationsList.filter(createFilterForLocations(query))
                : ctrl.locationsList
            return results
        }

        function createFilterForLocations(query) {
            var lowercaseQuery = query.toLowerCase()
            return function filterFn(location) {
                const lower_case_location_name = location.label.toLowerCase()
                return lower_case_location_name.includes(lowercaseQuery)
            }
        }

        function getProceduresMatchesAll() {
            return new Promise(function(resolve, reject) {
                GlobalServices.getProcedures('MMEDQ1_ALLC*#_.').then(function(autocompleteResult) {
                    var listProcedure = []
                    listProcedure.push({ label: 'All', value: -1, keywords: '' })
                    if (autocompleteResult.data.length != 0) {
                        autocompleteResult.data.forEach(function(queryResult) {
                            listProcedure.push({
                                label: queryResult.procedure_Name
                                    ? queryResult.procedure_Name.trim()
                                    : '',
                                value: queryResult.procedure_ID,
                                keywords: queryResult.keywords,
                            })
                        })
                    }

                    ctrl.selectedProcedureItem.procedures = listProcedure.find(x => {
                        if (!ctrl.searchObj) {
                            return
                        }
                        return x.value == +ctrl.searchObj.procedureId
                    })

                    resolve(listProcedure)
                })
            }).then(function(resultList1) {
                return resultList1
            })
        }

        getProceduresMatchesAll().then(list_of_procedures => {
            ctrl.procedureList = list_of_procedures
        })

        ctrl.querySearchProcedures = function(query) {
            const results = query
                ? ctrl.procedureList.filter(createFilterForProcedures(query))
                : ctrl.procedureList

            return results
        }

        function createFilterForProcedures(query) {
            var lowercaseQuery = query.toLowerCase()

            return function filterFn(service) {
                const keywords = service.keywords
                    ? service.keywords
                          .toLowerCase()
                          .split(',')
                          .map(k => k.trim())
                    : ''
                const lower_case_service_name = service.label.toLowerCase()

                if (!keywords || keywords.length == 0) {
                    return false
                }

                return (
                    lower_case_service_name.includes(lowercaseQuery) ||
                    keywords.find(k => k.includes(lowercaseQuery))
                )
            }
        }

        ctrl.processSearch = function() {
            ctrl.countrySearch = ctrl.searchObj && ctrl.searchObj.country

            const procedureSearch = !ctrl.selectedProcedureItem.procedures
                ? 0
                : ctrl.selectedProcedureItem.procedures.value == -1
                ? 0
                : ctrl.selectedProcedureItem.procedures.value

            const locationSearch = !ctrl.selectedLocationItem.locations
                ? 'undefined'
                : ctrl.selectedLocationItem.locations == -1 ||
                  ctrl.selectedLocationItem.locations.value == -1
                ? 'undefined'
                : ctrl.selectedLocationItem.locations.value

            const categorySearch = ctrl.categorySearch || 0

            const countrySearch = ctrl.countrySearch || undefined

            $window.location.href =
                '/list_procedures?procedure=' +
                procedureSearch +
                '&location=' +
                locationSearch +
                '&category=' +
                categorySearch +
                '&speciality=0&country=' +
                countrySearch
        }

        function getMainCategoryMatchesAll() {
            return new Promise(function(resolve, reject) {
                GlobalServices
                    .getCategoriesListSearch('MMEDQ1_ALLC*#_.')
                    .then(function(autocompleteResult) {
                        const categoryList = []
                        if (autocompleteResult.data.length != 0) {
                            autocompleteResult.data.forEach(function(queryResult) {
                                categoryList.push({
                                    label: queryResult.category_Name,
                                    value: queryResult.category_ID,
                                })
                            })
                        }
                        resolve(categoryList)
                    })
            })
        }

        getMainCategoryMatchesAll().then(function(resultListCategories) {
            ctrl.categoryList = resultListCategories
        })
    },
})
