'use strict'

angular.module('listModule').component('listModule', {
    templateUrl: './app/list/list.component.html',
    controller: [
        '$rootScope',
        '$scope',
        'ListServices',
        'GlobalServices',
        'ServiceServices',
        '$q',
        'NgMap',
        '$translate',
        '$mdDialog',
        '$window',
        '$mdSidenav',
        '$location',
        '$cookies',
        function ListController(
            $rootScope,
            $scope,
            ListServices,
            GlobalServices,
            ServiceServices,
            $q,
            NgMap,
            $translate,
            $mdDialog,
            $window,
            $mdSidenav,
            $location,
            $cookies
        ) {
            const showToastMsg = GlobalServices.showToastMsg
            $scope.displayedListLength = 0
            $scope.servicesList = []
            $scope.servicesListAll = []

            $scope.procedure_price_by_provider = {}
            $scope.procedure_price_by_provider_first = {}
            $scope.procedure_price_by_provider_extra = {}

            $scope.allServicesList = []
            $scope.selectedService = {}
            $scope.isModalOpen = false
            $scope.requiredDocuments = []
            $scope.submit = {}
            // $scope.serviceOptions = []
            // $scope.optionItems = {}
            // $scope.selectedItems = {}
            $scope.message = {}
            $scope.breadcrumbsList = {}
            $scope.user = {}
            $scope.searchText = {}
            $scope.enteredCity = ''
            $scope.radius = {}
            var enteredLocation = {}
            var use_set_location = true
            $scope.user_actual_location = {
                coordinates: '',
                city: '',
            }
            $scope.user_search_location = undefined
            let distance_filter_used = false
            $scope.disable_distance_filtering = false

            $scope.globalCartID = ''

            $scope.categoryList = []
            $scope.countryList = []

            $scope.zoomVar = 5
            $scope.numResultPerPages = 0
            $scope.actResultPerPages = 1

            $scope.categorySearch
            $scope.countrySearch
            $scope.show_provider_only = false
            $scope.centeredLocationMap = 'current-location'

            $scope.showServiceOptionsData = false

            //pagination
            $scope.currentPage = 0
            $scope.pageSize = 15
            $scope.resulPerPage = 15
            $scope.showGridMap = false
            $scope.coordinatesList = []

            $scope.searchObj = {}

            $scope.scroller = { defaultDistance: 100 }
            $scope.distance_scroll_options = {
                size: 205,
                unit: ' KM',
                barWidth: 23,
                trackColor: 'rgba(33,33,33,.2)',
                barColor: 'rgba(75,140,191,1)',
                trackWidth: 15,
                subText: {
                    enabled: true,
                    text: 'Distance',
                },
                max: 200,
                step: 1,
                dynamicOptions: true,
                displayPrevious: true,
            }
            $scope.star_filter = { provider_review_score: 0 }

            $rootScope.$on('schedule-appointment-dialog-closed', function(event, args) {
                $scope.isModalOpen = false
            })

            function getUser(token) {
                GlobalServices.getUserProfile(token).then(function(userData) {
                    if (userData.data.username !== undefined) {
                        $scope.user.username = userData.data.username
                        $scope.user.name = userData.data.user_UserName
                        $scope.user.profileId = userData.data.profileId
                        $scope.user.ID = userData.data.ID
                        $scope.user.uniqueID = userData.data.uniqueID
                        $scope.user.profileType = userData.data.profileType
                        $scope.user.email = userData.data.email
                        $scope.user.Skype = userData.data.Skype
                        $scope.user.WhatsApp = userData.data.WhatsApp
                        $scope.user.phone = userData.data.phone
                        $scope.user.dateOfJoin = userData.data.dateOfJoin
                        $scope.user.address = userData.data.addres
                        $scope.user.status = userData.data.status
                        $scope.user.street = userData.data.street
                        $scope.user.country = userData.data.country
                        $scope.user.city = userData.data.city
                        $scope.user.state = userData.data.state
                        $scope.user.postalCode = userData.data.postalCode
                        $scope.user.timezone = userData.data.timezone
                    } else {
                    }
                })
            }

            $scope.filterByStars = async function(value, star_review) {
                let services_to_filter = []
                if (distance_filter_used) {
                    services_to_filter = await $scope.changeOptionsDistanceScroll()
                } else {
                    services_to_filter = $scope.servicesListAll
                }
                const filtered_services_list = services_to_filter.filter(service => {
                    if (!value && service.provider_review_score >= star_review) {
                        return service
                    } else if (value) {
                        return service
                    }
                })
                setPagination(filtered_services_list)
            }

            /**
             * @author Jorge Medina
             */
            function filterByDistance(data_) {
                var q = $q.defer()
                var count_ = 0
                var servicesList_ = []
                if (data_.length != 0) {
                    if (!use_set_location && !data_.actLocation) {
                        q.resolve(data_)
                        return q.promise
                    }

                    data_.forEach(function(result_) {
                        var totalDistance
                        if (use_set_location) {
                            result_.distance_FromSearch = result_.distance_km
                        } else {
                            totalDistance = Math.round(
                                getDistanceBetween2Points(data_.actLocation, {
                                    latitude: result_.provider_latitude,
                                    longitude: result_.provider_longitude,
                                }) / 1000
                            )
                            result_.distance_FromSearch = totalDistance
                        }
                        servicesList_.push(result_)
                        if (count_ == data_.length - 1) {
                            q.resolve(servicesList_)
                        } else {
                            count_++
                        }
                    })
                } else {
                    q.resolve(-1)
                }
                return q.promise
            }

            /**
             * @author Jorge Medina
             */
            $scope.parseUrl = function() {
                $scope.servicesList = []
                async function makeSearchPromise() {
                    await GlobalServices.customerIPHandler()
                    var q = $q.defer()
                    $scope.countryList = getMainCountryMatchesAll()
                    var paramSearch = getUrlParams()

                    if (paramSearch != null) {
                        $scope.countrySearch = $scope.countrySearch.replace(/%20/g, ' ')
                        ListServices.findServicesBySearchTerms(JSON.stringify(paramSearch))
                            .then(async function(serviceResultAll_) {
                                $scope.servicesListAll = serviceResultAll_.data.services
                                let filteredServicesList = serviceResultAll_.data.services
                                $scope.user_actual_location.city = serviceResultAll_.data.location

                                if (serviceResultAll_.data.services) {
                                    if (serviceResultAll_.data.services.length) {
                                        $scope.procedure_price_by_provider = _.groupBy(
                                            serviceResultAll_.data.services.map(p => {
                                                return {
                                                    provider_ID: p.provider_ID,
                                                    procedure_ID: p.procedure_ID,
                                                    procedure_Name: p.procedure_Name,
                                                    price: p.price,
                                                    service_consultationCost:
                                                        p.service_consultationCost,
                                                    service_ID: p.service_ID,
                                                    service_PriceFactor: p.service_PriceFactor,
                                                }
                                            }),
                                            'provider_ID'
                                        )
                                        $scope.procedure_price_by_provider_first = _.groupBy(
                                            Object.values($scope.procedure_price_by_provider)
                                                .map(v => v.slice(0, 10))
                                                .flat(),
                                            i => i.provider_ID
                                        )

                                        $scope.procedure_price_by_provider_extra = _.groupBy(
                                            Object.values($scope.procedure_price_by_provider)
                                                .map(v => v.slice(10))
                                                .flat(),
                                            i => i.provider_ID
                                        )

                                        if ($scope.searchObj.procedureId !== '0') {
                                            const prefix = await GlobalServices.getTranslation(
                                                'List.TitleDentistsFor'
                                            )
                                            $scope.pageTitle = `${prefix} ${serviceResultAll_.data.services[0].procedure_Name}`
                                            if (
                                                $scope.searchObj.location &&
                                                $scope.searchObj.location != 'undefined'
                                            ) {
                                                $scope.pageTitle = `${prefix} ${serviceResultAll_.data.services[0].procedure_Name} In ${$scope.searchObj.location}`
                                            }
                                        } else if ($scope.searchObj.location != 'undefined') {
                                            const prefix = await GlobalServices.getTranslation(
                                                'List.TitleDentistsIn'
                                            )
                                            $scope.pageTitle = `${prefix} ${$scope.searchObj.location}`
                                            /* if only searching by location, show single instance of clinic */
                                            $scope.show_provider_only = true
                                            filteredServicesList = _.uniqBy(
                                                $scope.servicesListAll,
                                                'provider_ID'
                                            )
                                        } else if (
                                            $scope.searchObj.categoryId &&
                                            $scope.searchObj.categoryId != '0'
                                        ) {
                                            $scope.pageTitle = `Top ${serviceResultAll_.data.services[0].category_Name} Dentists and Clinics`

                                            /* if only searching by location, show single instance of clinic */
                                            $scope.show_provider_only = true
                                            filteredServicesList = _.uniqBy(
                                                $scope.servicesListAll,
                                                'provider_ID'
                                            )
                                        } else {
                                            $scope.pageTitle = `Top Dentists and Clinics`
                                        }
                                    }

                                    q.resolve(filteredServicesList)
                                } else {
                                    q.reject('SERVICE_LIST_NOT_FOUND')
                                }
                            })
                            .catch(function(err) {
                                showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                                console.log('Unexpected Error : ' + '  ' + err)
                                q.reject('Error making the search..')
                            })
                    } else {
                        q.reject('EMPTY_SEARCH_PARAMETERS')
                    }

                    return q.promise
                }

                $scope.promise = makeSearchPromise()
                $scope.promise
                    .then(function(services) {
                        return getRelativeLocationForServices(services)
                    })
                    .then(
                        function(services_with_client_location) {
                            return filterByDistance(services_with_client_location)
                        },
                        function(services_without_client_location) {
                            $scope.disable_distance_filtering =
                                !$scope.user_actual_location.coordinates && !use_set_location
                            if ($scope.disable_distance_filtering) {
                                return services_without_client_location
                            }
                            return filterByDistance(services_without_client_location)
                        }
                    )
                    .then(
                        function(services_filtered_by_distance) {
                            if (services_filtered_by_distance.length != 0) {
                                if (services_filtered_by_distance != -1) {
                                    showToastMsg(
                                        'MyMedQ_MSG.List.ServicesFoundSuccessMsg1',
                                        'SUCCESS'
                                    )
                                    $scope.numResultPerPages = services_filtered_by_distance.length
                                    $scope.servicesList = services_filtered_by_distance.slice(
                                        $scope.currentPage * $scope.pageSize,
                                        ($scope.currentPage + 1) * $scope.pageSize
                                    )
                                } else {
                                    showToastMsg('MyMedQ_MSG.List.ServicesNFE1', 'INFO')
                                    $scope.numResultPerPages = 0
                                    $scope.servicesList = []
                                }
                            } else {
                                showToastMsg('MyMedQ_MSG.List.ServicesNFE1', 'INFO')
                                $scope.numResultPerPages = 0
                                $scope.servicesList = []
                            }
                        },
                        function(err) {
                            console.log('Error :: ' + JSON.stringify(err))
                            return false
                        }
                    )
                    .catch(function(err) {
                        console.log(err)
                    })
            }

            if ($cookies.getObject('MyMedQuestC00Ki3')) {
                getUser($cookies.getObject('MyMedQuestC00Ki3').token)
            }

            $scope.parseUrl()

            $scope.goToService = function(service) {
                $window.location.href = `/service_details?hospitalID=${service.provider_ID}&procedure=${service.procedure_ID}`
            }

            function getUrlParams() {
                if (
                    window.location.href.includes('procedure') &&
                    window.location.href.includes('location')
                ) {
                    const search = $location.search()
                    if (search.location === 'undefined') {
                        use_set_location = false
                    } else {
                        $scope.user_search_location = search.location
                    }
                    $scope.categorySearch = search.category
                    $scope.procedureSearch = search.procedure == '0' ? 0 : search.procedure
                    $scope.countrySearch = search.country

                    $scope.searchObj = {
                        procedureId: search.procedure,
                        location: search.location,
                        categoryId: search.category == 0 ? '0' : search.category,
                        specialityId: !search.specialty ? 'undefined' : search.specialty,
                        country: search.country == 0 ? 'undefined' : search.country,
                        show_test: search.show_test,
                    }
                } else {
                    $scope.searchObj = null

                    var confirm = $mdDialog
                        .confirm()
                        .title(
                            $scope.setLanguage == 'SP'
                                ? 'SERVICIO NO ENCONTRADO'
                                : 'SERVICE NOT FOUND'
                        )
                        .textContent(
                            $scope.setLanguage == 'SP'
                                ? 'Servicio no encontrado. IntÃ©ntalo de nuevo'
                                : 'Service not found. please try again'
                        )
                        .ariaLabel(
                            $scope.setLanguage == 'SP'
                                ? 'POR FAVOR LEA PRIMERO PARA CONTINUAR'
                                : 'PLEASE READ FIRST TO CONTINUE'
                        )
                        .ok('CONTINUE')

                    $mdDialog
                        .show(confirm)
                        .then(function() {
                            window.location.href = '/index'
                        })
                        .catch(function(err) {
                            console.log('Unexpected Error .....' + err)
                            window.location.href = '/index'
                        })
                }

                return $scope.searchObj
            }

            function setPagination(service_list) {
                $scope.currentPage = 0
                if (service_list.length > 0) {
                    $scope.numResultPerPages = service_list.length
                    $scope.servicesList = []
                    $scope.servicesList = service_list.slice(
                        $scope.currentPage * $scope.pageSize,
                        ($scope.currentPage + 1) * $scope.pageSize
                    )
                    $scope.$digest()
                } else {
                    showToastMsg('MyMedQ_MSG.List.ServicesNFE1', 'INFO')
                    $scope.numResultPerPages = 0
                    $scope.servicesList = []
                }
            }

            function getRelativeLocationForServices(services_list) {
                if (!services_list) {
                    return []
                }
                return $q(async function(resolve, reject) {
                    try {
                        const pos = await getUserGeoLocation()
                        if (!pos) {
                            reject(services_list)
                            return
                        }
                        services_list.actLocation = pos
                        resolve(services_list)
                    } catch (err) {
                        console.log(err)
                        const pos = await getUserGeoLocation(false)
                        if (!pos) {
                            reject(services_list)
                        }
                    }
                })
            }

            async function getUserGeoLocation(high_accuracy = true) {
                if (!navigator.geolocation) {
                    showToastMsg('Geolocation is not supported by this browser.', 'ERROR')
                    console.log('Geolocation is not supported by this browser.')
                    return
                }
                return new Promise(function(resolve) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            var pos = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            }
                            $scope.user_actual_location.coordinates = pos
                            resolve(pos)
                        },
                        function(err) {
                            showToastMsg('Geolocation is not supported by this browser.', 'ERROR')
                            console.log('Geolocation is not supported by this browser.')
                            resolve()
                        },
                        { timeout: 3000, enableHighAccuracy: high_accuracy }
                    )
                })
            }

            async function getSetLocation(urlLocationParam) {
                const set_location_coordinates = await getLatitudeLongitudeByAddress(
                    urlLocationParam
                )
                return set_location_coordinates
            }

            /**
             * @author Jorge Medina
             */
            function filterByDistanceScroll(data_, position) {
                var q = $q.defer()
                var count_ = 0
                var servicesList_ = []

                data_.forEach(function(result_, i) {
                    var totalDistance
                    totalDistance = Math.round(
                        getDistanceBetween2Points(position, {
                            latitude: result_.provider_latitude,
                            longitude: result_.provider_longitude,
                        }) / 1000
                    )
                    if (!isNaN(totalDistance)) {
                        if (totalDistance <= $scope.scroller.defaultDistance) {
                            result_.distance_FromSearch = totalDistance
                            servicesList_.push(result_)
                        }
                    }

                    if (count_ == data_.length - 1) {
                        q.resolve(servicesList_)
                    }
                    count_++
                })
                return q.promise
            }

            /**
             * @author Jorge Medina
             */
            $scope.changeOptionsDistanceScroll = async function() {
                distance_filter_used = true
                let services_to_paginate = {}
                if (use_set_location) {
                    const formatted_set_user_location = await getSetLocationCoordinates()
                    services_to_paginate = await filterByDistanceScroll(
                        $scope.servicesListAll,
                        formatted_set_user_location
                    )
                } else {
                    if ($scope.user_actual_location.coordinates) {
                        const actual_user_location = await getUserGeoLocation()
                        services_to_paginate = await filterByDistanceScroll(
                            $scope.servicesListAll,
                            actual_user_location
                        )
                    } else {
                        services_to_paginate = $scope.servicesListAll
                    }
                }

                setPagination(services_to_paginate)
                return services_to_paginate
            }

            $scope.toggleLeft = buildTogglerLeft('left')

            async function getSetLocationCoordinates() {
                const set_user_location = getUrlParams()
                const set_user_location_coordinates = await getSetLocation(
                    set_user_location.location
                )

                return {
                    latitude: set_user_location_coordinates.lat,
                    longitude: set_user_location_coordinates.long,
                }
            }

            /**
             * @author jorgemedinabernal
             */
            $scope.close = function() {
                $mdSidenav('left')
                    .close()
                    .then(function() {})
                    .catch(function(err) {
                        showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                        console.log('Unexpected Error : ' + err)
                    })
            }

            /**
             * @author Jorge Medina
             */
            $scope.searchByCategory = function(categoryId) {
                $scope.procedureSearch =
                    $scope.procedureSearch == undefined
                        ? 0
                        : $scope.procedureSearch == -1
                        ? 0
                        : $scope.procedureSearch
                $scope.locationSearch = $scope.locationSearch || 'undefined'
                $scope.categorySearch = categoryId || 0
                $window.location.href =
                    '/list_procedures?procedure=' +
                    $scope.procedureSearch +
                    '&location=' +
                    $scope.locationSearch +
                    '&category=' +
                    ($scope.categorySearch == undefined
                        ? 0
                        : $scope.categorySearch == -1
                        ? 0
                        : $scope.categorySearch) +
                    '&speciality=0&country=' +
                    $scope.countrySearch
            }

            /**
             * @author Jorge Medina
             */
            $scope.searchByCountry = function(country) {
                $scope.procedureSearch =
                    $scope.procedureSearch == undefined
                        ? 0
                        : $scope.procedureSearch == -1
                        ? 0
                        : $scope.procedureSearch
                $scope.locationSearch = $scope.locationSearch || 'undefined'
                $scope.countrySearch = country
                var urlR =
                    '/list_procedures?procedure=' +
                    $scope.procedureSearch +
                    '&location=' +
                    $scope.locationSearch +
                    '&category=' +
                    ($scope.categorySearch == undefined
                        ? 0
                        : $scope.categorySearch == -1
                        ? 0
                        : $scope.categorySearch) +
                    '&speciality=0&country=' +
                    ($scope.countrySearch == undefined
                        ? 0
                        : $scope.countrySearch == -1
                        ? 0
                        : $scope.countrySearch)
                $window.location.href = urlR
            }

            /**
             * @author Jorge Medina
             */
            function buildTogglerLeft(navID) {
                return function() {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function() {})
                        .catch(function(err) {
                            showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                            console.log('Unexpected Error : ' + err)
                        })
                }
            }

            /**
             * @author Jorge Medina
             */
            $scope.numberOfPages = function() {
                return Math.ceil($scope.numResultPerPages / $scope.resulPerPage)
            }

            $scope.filterBy = function(actual, expected) {
                return _.contains(expected, actual) // uses underscore library contains method
            }

            GlobalServices.getCustomerPreferredLanguage().then(function(lang) {
                if (lang.data != undefined) {
                    $translate.use(lang.data)
                }
            })

            /**
             * @author Jorge Medina
             */
            function getDistanceBetween2Points(pointA, pointB) {
                return google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(
                        parseFloat(pointA.latitude),
                        parseFloat(pointA.longitude)
                    ),
                    new google.maps.LatLng(
                        parseFloat(pointB.latitude),
                        parseFloat(pointB.longitude)
                    )
                )
            }

            /**
             * @author Jorge Medina
             */
            function getMainCountryMatchesAll() {
                new Promise(function(resolve, reject) {
                    ListServices.getCountriesListSearch().then(function(autocompleteResult) {
                        if (autocompleteResult.data.length != 0) {
                            $scope.countryList = []
                            $scope.countryList.push({ label: 'All', value: -1 })
                            autocompleteResult.data.forEach(function(queryResult) {
                                $scope.countryList.push({
                                    label: queryResult.provider_Country,
                                    value: queryResult.provider_Country,
                                })
                            })
                        }
                        resolve($scope.countryList)
                    })
                }).then(function(resultListCategories) {
                    return resultListCategories
                })
            }

            /**
             * @author Jorge Medina
             */
            $scope.showPacesListMaps = function(showVarGridMap) {
                var arrayLocations = []
                $scope.showGridMap = !$scope.showGridMap

                $scope.fillArrayLocations = function() {
                    var count = 0
                    var q = $q.defer()
                    var locationsValues = ''

                    $scope.servicesList.forEach(function(service) {
                        getLatitudeLongitudeByAddress(
                            service.provider_Street +
                                ' ' +
                                service.provider_City +
                                ' ' +
                                service.provider_State +
                                ' ' +
                                service.provider_Country +
                                ', ' +
                                service.provider_PostalCode,
                            true
                        ).then(function(result) {
                            locationsValues += result.lat + '*' + result.long + '@'
                            if (count == $scope.servicesList.length - 1) {
                                q.resolve(locationsValues)
                            }
                            count += 1
                        })
                    })
                    return q.promise
                }

                $scope.putLocationsOnGMap = function(locations) {
                    var q = $q.defer()
                    NgMap.getMap().then(function(map) {
                        var markers = []
                        var array_ = locations.split('@')
                        for (var i = 0; i < array_.length; i++) {
                            markers[i] = new google.maps.Marker({ title: 'Marker: ' + i })
                            var lat = array_[i].split('*')[0]
                            var lng = array_[i].split('*')[1]
                            var loc = new google.maps.LatLng(lat, lng)

                            markers[i].setPosition(loc)
                            markers[i].setMap(map)

                            if (i == array_.length - 1) {
                                q.resolve(markers)
                            }
                        }
                    }, 1000)
                    return q.promise
                }

                $scope.promise = $scope.fillArrayLocations()
                $scope.promise
                    .then(function(v) {
                        return $scope.putLocationsOnGMap(v)
                    })
                    .then(
                        function(obj) {
                            showToastMsg('MyMedQ_MSG.List.CorrectelySuccess1', 'INFO')
                        },
                        function(err) {
                            console.log('Error deploying the locations :: ' + err)
                            showToastMsg('MyMedQ_MSG.List.LocationErrDE1', 'ERROR')
                        }
                    )
            }

            /**
             * @author Jorge Medina
             */
            $scope.showDetaiPlaceInMaps = function(serviceObj) {
                if (serviceObj != undefined) {
                    var location_ =
                        serviceObj.provider_Street +
                        ' ' +
                        serviceObj.provider_City +
                        ' ' +
                        serviceObj.provider_State +
                        ', ' +
                        serviceObj.provider_PostalCode

                    getLatitudeLongitudeByAddress(location_, true).then(function(result) {
                        var lat = result.lat
                        var lng = result.long
                        $scope.centeredLocationMap = lat + ', ' + lng
                    })
                }
            }

            /**
             * @author Jorge Medina
             */
            $scope.validateValue = function(num) {
                if (num != undefined) {
                    var p = num.toFixed(2).split('.')
                    return (
                        '' +
                        p[0]
                            .split('')
                            .reverse()
                            .reduce(function(acc, num, i, orig) {
                                return num == '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc
                            }, '') +
                        '.' +
                        p[1]
                    )
                } else {
                    return num
                }
            }

            /**
             * @author Jorge Medina
             */
            $scope.eventOverM = function(serviceObj) {
                $scope.getNewGeoCenter = function(location_) {
                    var q = $q.defer()

                    getLatitudeLongitudeByAddress(location_, true).then(function(result) {
                        var lat = result.lat
                        var lng = result.long
                        q.resolve(lat + ', ' + lng)
                    })
                    return q.promise
                }

                $scope.promise = $scope.getNewGeoCenter(
                    serviceObj.provider_Street +
                        ' ' +
                        serviceObj.provider_City +
                        ' ' +
                        serviceObj.provider_State +
                        ', ' +
                        serviceObj.provider_PostalCode
                )
                $scope.promise.then(
                    function(obj) {
                        $scope.zoomVar = 15
                        $scope.centeredLocationMap = obj
                    },
                    function(err) {
                        showToastMsg('MyMedQ_MSG.List.LocationErrDE1', 'ERROR')
                    }
                )
            }

            /**
             * @author Jorge Medina
             */
            $scope.selectNextBack = function(option) {
                if (option == 'N') {
                    if ($scope.servicesListAll.length > $scope.resulPerPage) {
                        $scope.currentPage++
                    }
                } else {
                    if ($scope.currentPage != 0) {
                        $scope.currentPage--
                    }
                }
                $scope.servicesList = $scope.servicesListAll.slice(
                    $scope.currentPage * $scope.pageSize,
                    ($scope.currentPage + 1) * $scope.pageSize
                )
            }

            $scope.filterServices = function(startIndex) {
                $scope.servicesFilteredByName = $scope.getData()
            }

            $scope.seeService = function(id, procedure) {
                location.href = '/listingDetails.html?hospitalID=' + id + '&procedure=' + procedure
            }

            $scope.openModal = function() {
                $scope.isModalOpen = true
            }

            $scope.selectService = async function(service) {
                $scope.selectedService.procedure_Name = service.procedure_Name
                $scope.selectedService.provider_Name = service.provider_Name
                $scope.selectedService.service_consultationCost = service.service_consultationCost
                $scope.selectedService.service_ID = service.service_ID
                $scope.selectedService.provider_ID = service.provider_ID
                $scope.selectedService.messageType = 'Consultation'
                $scope.selectedService.email = service.provider_Email
                $scope.selectedService.price = service.price
                $scope.selectedService.procedure_ID = service.procedure_ID
                $scope.openModal()

                const {
                    data: documentsData,
                } = await ServiceServices.getAllDocumentsRequiredByServiceId(service.service_ID)
                $scope.requiredDocuments = documentsData
            }

            $scope.openConsultationInformationModal = async function(ev) {
                const consultation_information = await GlobalServices.getConsultationInformation()
                $mdDialog
                    .show({
                        locals: {
                            consultationInformation: consultation_information.data.htmlTerms,
                        },
                        controller: consultationInfoDialogController,
                        templateUrl: '/dialogTemplate/ConsultationInformation.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: false,
                    })
                    .then(function() {
                        return
                    })
                    .catch(function() {
                        return
                    })
            }

            function consultationInfoDialogController($scope, consultationInformation) {
                $scope.consultationInformation = consultationInformation

                $scope.cancel = function() {
                    $mdDialog.cancel()
                }
            }

            $scope.sendMessage = function(selectedService, user, e) {
                console.log(selectedService)
                selectedService.messageType = 'Message'

                if (!$scope.user.ID) {
                    console.log('you need to log in')
                    showToastMsg('MyMedQ_MSG.List.NeedLogIngE1', 'ERROR')
                } else if (user.ID == selectedService.provider_ID) {
                    console.log('you cant message yourself')
                    showToastMsg('MyMedQ_MSG.List.NeedLogIngE2', 'ERROR')
                } else if (user.profileType == 'Provider') {
                    console.log('you cant sign up with a Provider account')
                    showToastMsg('MyMedQ_MSG.List.NeedLogIngE3', 'ERROR')
                } else {
                    ListServices.contactProvider(selectedService, user).then(function(message) {
                        if (message.data.status < 0) {
                            $scope.submit.confirmation = message.data.message
                            showToastMsg('MyMedQ_MSG.List.RequestErrorE2', 'ERROR')
                        } else {
                            $scope.message.confirmation =
                                'Your message has been sent, please wait for the hospital to reply'
                            showToastMsg('MyMedQ_MSG.List.AppSuccessMsg1', 'SUCCESS')
                        }
                    })
                }
            }

            function getLatitudeLongitudeByAddress(address) {
                return new Promise(function(resolveMain, reject) {
                    return new Promise(function(resolve, reject) {
                        address = address || $scope.placeToCenterByDefault
                        geocoder = new google.maps.Geocoder()
                        console.log(geocoder)
                        if (geocoder) {
                            geocoder.geocode(
                                {
                                    address: address,
                                },
                                function(results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        resolve(results[0].geometry.location)
                                    }
                                    if (status == 'OVER_QUERY_LIMIT') {
                                        console.log('>> OVER_QUERY_LIMIT.')
                                        //resolve(status);
                                        resolveMain(null)
                                    }
                                }
                            )
                        }
                    })
                        .then(function(result) {
                            enteredLocation.lat = parseFloat(JSON.parse(JSON.stringify(result)).lat)
                            enteredLocation.long = parseFloat(
                                JSON.parse(JSON.stringify(result)).lng
                            )
                            resolveMain(enteredLocation)
                        })
                        .catch(function(err) {
                            console.log('Error type: ' + err)
                            showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                            resolveMain(null)
                        })
                }).then(function(resultMain) {
                    return resultMain
                })
            }
        },
    ],
})
