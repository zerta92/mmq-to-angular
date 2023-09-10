import _ from 'lodash'

angular.module('servicesSearchDropdownModule').component('servicesSearchDropdown', {
    templateUrl: './app/components/services-search-dropdown/services_search_dropdown.template.html',
    bindings: {},
    controller: [
        '$rootScope',
        'GlobalServices',
        '$route',
        '$location',
        function ServiceSearchDropdownController($rootScope, GlobalServices, $route, $location) {
            var ctrl = this

            this.$onInit = function() {}

            ctrl.selectedProcedureItem = { procedures: '' }
            ctrl.selectedLocationItem = { locations: '' }

            ctrl.countrySearch = {}
            ctrl.countryList = []
            ctrl.use_set_location = false

            function getUrlParams() {
                if (window.location.href.includes('list_procedures')) {
                    ctrl.showAllFields = true
                }
                const { procedure, location, category, country } = $route.current.params
                if (procedure && location) {
                    if (location === 'all') {
                        ctrl.use_set_location = false
                    } else {
                        ctrl.user_search_location = location
                    }
                    ctrl.categorySearch = category
                    ctrl.procedureSearch = procedure == '0' ? 0 : procedure
                    ctrl.countrySearch = country

                    const searchObj = {
                        procedureId: procedure,
                        location: location
                            .replace(/%20/g, '')
                            .replace(/\//g, '')
                            .replace(/\\/g, '')
                            .replace(/\s/g, ''),
                        categoryId: category,
                        country: country == 'all' ? 'undefined' : country,
                        show_test: false,
                    }

                    ctrl.categorySearch = category
                    return searchObj
                }
            }

            ctrl.searchObj = getUrlParams()
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
                                    country: location.provider_Country,
                                })
                            })

                            resultList = _.uniqBy(resultList, location => {
                                return location.label.toLowerCase().trim()
                            })
                        }

                        ctrl.countrySearch = resultList.find(x => {
                            if (!ctrl.searchObj || x.label == 'All') {
                                return
                            }

                            const search_country = x.country.replace(/\s/g, '')
                            return search_country === decodeURIComponent(ctrl.searchObj.country)
                        })

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
                    ctrl.countryList = _.uniqBy(ctrl.locationsList, 'flag').filter(
                        c => c.label != 'All'
                    )
                })
            })()

            ctrl.querySearchLocations = function(query) {
                return ctrl.locationsList.filter(createFilterForLocations(query))
            }

            function createFilterForLocations(query) {
                var lowercaseQuery = query.toLowerCase()
                return function filterFn(location) {
                    const lower_case_location_name = location.label.toLowerCase()
                    const filter_by_country =
                        ctrl.countrySearch && ctrl.countrySearch.country
                            ? location.country === ctrl.countrySearch.country
                            : true

                    return lower_case_location_name.includes(lowercaseQuery) && filter_by_country
                }
            }

            function getProceduresMatchesAll() {
                return new Promise(function(resolve, reject) {
                    GlobalServices.getProcedures('MMEDQ1_ALLC*#_.').then(function(
                        autocompleteResult
                    ) {
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
                // ctrl.countrySearch = ctrl.searchObj && ctrl.searchObj.country

                const procedureSearch = !ctrl.selectedProcedureItem.procedures
                    ? 0
                    : ctrl.selectedProcedureItem.procedures.value == -1
                    ? 0
                    : ctrl.selectedProcedureItem.procedures.value

                const locationSearch = !ctrl.selectedLocationItem.locations
                    ? 'all'
                    : ctrl.selectedLocationItem.locations == -1 ||
                      ctrl.selectedLocationItem.locations.value == -1
                    ? 'all'
                    : ctrl.selectedLocationItem.locations.value

                const categorySearch = ctrl.categorySearch || 0

                const countrySearch = ctrl.countrySearch
                    ? ctrl.countrySearch.country || 'all'
                    : 'all'

                // $rootScope.trackCustomerAction({
                //     action: 'service_search',
                //     url: $location.absUrl(),
                //     agent: window.navigator.userAgent,
                //     miscellaneous: `${procedureSearch}-${locationSearch}`,
                // })

                window.dataLayer = window.dataLayer || []
                dataLayer.push({
                    event: 'formSubmission',
                    formType: 'Service Search',
                    service: `${procedureSearch}-${locationSearch}`,
                })

                $location.path(
                    `/list_procedures/procedure/${procedureSearch}/location/${locationSearch}/category/${categorySearch}/country/${countrySearch}`
                )
            }

            function getMainCategoryMatchesAll() {
                return new Promise(function(resolve, reject) {
                    GlobalServices.getCategoriesListSearch('MMEDQ1_ALLC*#_.').then(function(
                        autocompleteResult
                    ) {
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
    ],
})
