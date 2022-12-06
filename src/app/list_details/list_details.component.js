'use strict'

angular.module('listDetailsModule').component('listDetailsModule', {
    templateUrl: './app/list_details/list_details.component.html',
    controller: [
        '$scope',
        'ListServices',
        'GlobalServices',
        'BrandServices',
        'ServiceServices',
        '$mdDialog',
        '$translate',
        '$sce',
        '$q',
        '$cookies',
        '$rootScope',
        'ngMeta',
        '$route',
        function ListDetailsController(
            $scope,
            ListServices,
            GlobalServices,
            BrandServices,
            ServiceServices,
            $mdDialog,
            $translate,
            $sce,
            $q,
            $cookies,
            $rootScope,
            ngMeta,
            $route
        ) {
            $scope.page_title = ''
            $scope.page_description = ''
            $scope.globalCartID = ''
            $scope.geoPoints = {}
            $scope.servicesList = {}
            $scope.has_services = false
            $scope.categories_by_provider = []
            $scope.procedure_price_by_provider = {}
            $scope.description_header = ''
            $scope.description_header2 = ''
            $scope.description_header3 = ''
            $scope.includesList = []
            $scope.providerImages = {}
            $scope.servicesImageList = []
            $scope.carruselImageList = []
            $scope.staffList = []
            $scope.serviceOptions = []
            $scope.reviewsInfoData = []
            $scope.service_brands = []
            $scope.requiredDocuments = []
            $scope.showProviderBanner = false
            $scope.show_other_info = false
            $scope.submit = {}
            $scope.message = {}
            $scope.isModalOpen = false
            $scope.providerInfo = {}
            $scope.user = {}
            $scope.headImage = {}
            $scope.setLanguage = 'EN'

            $scope.airbnbInfoData = new Array()
            $scope.ContentPDF = null
            $scope.isOpen = 'CLOSED'

            $scope.hospitalId
            $scope.reviewsObj = undefined
            $scope.averageData = {}
            $scope.showServiceOptionsData = false

            $scope.rate = 0
            $scope.max = 5
            $scope.isReadonly = false

            $rootScope.$on('schedule-appointment-dialog-closed', function(event, args) {
                $scope.isModalOpen = false
            })

            const showToastMsg = GlobalServices.showToastMsg

            $scope.toggleBounce = function() {
                if (this.getAnimation() != null) {
                    this.setAnimation(null)
                } else {
                    this.setAnimation(google.maps.Animation.BOUNCE)
                }
            }
            ;(async function getCustomerPreferredLanguage() {
                const preferred_language = await GlobalServices.getCustomerPreferredLanguage()
                const language = $route.current.params.language || preferred_language.data
                if (language) {
                    await GlobalServices.setCustomerPreferredLanguage(language)
                    $translate.use(language)
                }
            })()

            $scope.openModal = function(params) {
                $scope.isModalOpen = true
            }

            $scope.ratingStates = [
                { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
                { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
                { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
                { stateOn: 'glyphicon-heart' },
                { stateOff: 'glyphicon-off' },
            ]

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

            function createDynamicProviderDescription() {
                $scope.description_header = $scope.provider.provider_Name
                $scope.description_header2 = `${$scope.provider.provider_Country} > ${$scope.provider.provider_State} > ${$scope.provider.provider_City}`
                $scope.description_header3 = `${$scope.categories_by_provider.join('&#8226')}`
            }

            $scope.validateValue = function(num) {
                if (num != undefined) {
                    var p = num.toFixed(2).split('.')
                    return (
                        '' +
                        p[0]
                            .split('')
                            .reverse()
                            .reduce(function(acc, num, i) {
                                return num == '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc
                            }, '') +
                        '.' +
                        p[1]
                    )
                } else {
                    return num
                }
            }

            function getReviewsAverage(provider_id) {
                ListServices.findAverageConsolidateReviewsByProviderId(provider_id)
                    .then(function(averageConsolidateData) {
                        $scope.averageData = averageConsolidateData.data
                        $scope.review_stars = Math.round(averageConsolidateData.data[0].avg_)
                    })
                    .catch(function(err) {
                        showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                        console.log('Unexpected Error71 .....' + err)
                    })
            }

            function getServicesImageCSS(hospitalId) {
                ListServices.getHospitalAttachments({ provider_ID: hospitalId }).then(function(
                    providerImages
                ) {
                    let header =
                        'linear-gradient(to top, rgb(19, 21, 25) 14%, rgba(0, 0, 0, 0.55) 66%), url(/template/img/background/noPhotoYet.png)'
                    if (providerImages.data.length != 0) {
                        providerImages.data.forEach(function(file_) {
                            if (!$scope.providerImages[file_.attachments_type]) {
                                $scope.providerImages[file_.attachments_type] = []
                            }
                            if (false && file_.attachments_type == 1) {
                                const image_service = $scope.servicesList.find(service => {
                                    return service.service_ID == file_.linked_service_id
                                })
                                const service_image_data = {
                                    filename: file_.attachments_name,
                                    label: image_service ? image_service.procedure_Name : '',
                                    procedure_ID: image_service
                                        ? image_service.procedure_ID
                                        : undefined,
                                }
                                $scope.providerImages[file_.attachments_type].push(
                                    service_image_data
                                )
                            } else {
                                $scope.providerImages[file_.attachments_type].push(
                                    file_.attachments_name
                                )
                            }
                        })
                        if ($scope.providerImages[0]) {
                            header = `linear-gradient(to top, rgb(19, 21, 25) 14%, rgba(0, 0, 0, 0.55) 66%), url(https://mymedquest.s3.us-east-2.amazonaws.com/providers/provider_${hospitalId}/${$scope.providerImages[
                                '0'
                            ][0].replace('MedQIMG_', '')}`
                        }

                        $scope.servicesImageList = $scope.providerImages['1']
                        $scope.carruselImageList = $scope.providerImages['2']
                    } else {
                    }
                    $scope.headImage = {
                        'margin-top': '60px',
                        background: header,
                        'background-size': 'cover',
                        position: 'relative',
                        padding: '250px 0px 70px 0px',
                        width: '100%',
                        'box-sizing': 'content-box',
                        content: '',
                        top: '0px',
                        bottom: '0px',
                        left: '0px',
                    }
                })
            }

            async function getStaffInfoByProviderId(providerId) {
                const staffInfo = await ListServices.getStaffByProviderId(providerId)

                return staffInfo.data
            }

            /**
             * @autor Jorge Enrique Medina
             */
            function getStudiesList(staffId) {
                var arrayReturn = []
                ListServices.getStudiesListByStaffId(staffId)
                    .then(function(staffInfo) {
                        arrayReturn = staffInfo.data
                        return arrayReturn
                    })
                    .catch(function(err) {
                        showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                    })
            }

            this.openMenu = function($mdMenu, ev) {
                originatorEv = ev
                $mdMenu.open(ev)
            }

            $scope.getStaffList = async function(urlParam) {
                $scope.staffList = await getStaffInfoByProviderId(urlParam)
            }

            $scope.getAirbnbData = function(city, state, country) {
                return
                var q = $q.defer()
                $scope.airbnbInfoData = getAirbnbData_(city + ', ' + state + ', ' + country)
                q.resolve($scope.airbnbInfoData)
                return q.promise
            }
            /**
             * @autor Jorge Enrique Medina
             */
            function getAirbnbData_(providerAddress) {
                var airbnbInfoDataAux = new Array()
                ListServices.getAirbnbInfo(providerAddress)
                    .then(function(airbnbData_) {
                        var arrayAirbnb_ = []
                        var i = 0

                        try {
                            if (
                                airbnbData_.data &&
                                airbnbData_.data.explore_tabs &&
                                airbnbData_.data.explore_tabs[0] &&
                                airbnbData_.data.explore_tabs[0].sections[0] &&
                                airbnbData_.data.explore_tabs[0].sections[0].listings != undefined
                            ) {
                                arrayAirbnb_ = airbnbData_.data.explore_tabs[0].sections[0].listings
                            } else if (
                                airbnbData_.data &&
                                airbnbData_.data.explore_tabs &&
                                airbnbData_.data.explore_tabs[0] &&
                                airbnbData_.data.explore_tabs[0].sections[1] &&
                                airbnbData_.data.explore_tabs[0].sections[1].listings != undefined
                            ) {
                                arrayAirbnb_ = airbnbData_.data.explore_tabs[0].sections[1].listings
                            }

                            if (arrayAirbnb_ != undefined) {
                                arrayAirbnb_.forEach(function(var_) {
                                    if (i < 7) {
                                        var insertType = {
                                            shortDescription:
                                                var_.listing.kicker_content.messages[0] +
                                                ' - ' +
                                                var_.listing.kicker_content.messages[1],
                                            name: var_.listing.name,
                                            imgUrl: var_.listing.picture_url,
                                            reviews: var_.listing.reviews_count,
                                            priceUsd: var_.pricing_quote.price_string,
                                            urlAirbnbClick: var_.listing.id,
                                        }
                                        airbnbInfoDataAux.push(insertType)
                                    }
                                    i++
                                })
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    })
                    .catch(function(err) {
                        showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                        console.log('Unexpected Error 6..' + err)
                    })
                return airbnbInfoDataAux
            }

            if ($cookies.getObject('MyMedQuestC00Ki3')) {
                getUser($cookies.getObject('MyMedQuestC00Ki3').token)
            }

            function getAllProviderServices(hospitalID) {
                return new Promise(function(resolve) {
                    ListServices.getProviderServicesGroupedByCategory({
                        provider_ID: hospitalID,
                    }).then(function(procedureData) {
                        resolve(procedureData.data)
                    })
                })
            }

            function setPageAttributes() {
                const is_service_title = $scope.service
                    ? `${$scope.service.procedure_Name}`
                    : `Dentist`

                const page_title = `${is_service_title} | ${$scope.provider.provider_City} (${$scope.provider.provider_Country}) | ${$scope.provider.provider_Name}`
                ngMeta.setTitle(page_title)
                const page_description = `Book an online or in-person consultation now. ${$scope
                    .provider.provider_Description &&
                    $scope.provider.provider_Description.slice(0, 150)}`
                // const page_description =
                // ($scope.provider.provider_Description &&
                //     $scope.provider.provider_Description.slice(0, 150)) ||
                //     $scope.service.procedure_DescriptionFull.slice(0, 150) + '...'

                ngMeta.setTag('description', page_description)
                const script = document.createElement('script')
                script.setAttribute('type', 'application/ld+json')
                script.textContent = JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Dental Clinic',
                    name: $scope.provider.provider_Name,
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: $scope.provider.provider_Street,
                        addressLocality: $scope.provider.provider_City,
                        addressRegion: $scope.provider.provider_State,
                        postalCode: $scope.provider.provider_PostalCode,
                        addressCountry: $scope.provider.provider_Country,
                    },

                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: $scope.provider.provider_latitude,
                        longitude: $scope.provider.provider_longitude,
                    },
                    // url: 'http://www.example.com/restaurant-locations/manhattan',
                    telephone: $scope.provider.provider_Phone,
                    openingHoursSpecification: [
                        {
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: $scope.provider.provider_daysServicesprovider
                                ? $scope.provider.provider_daysServicesprovider.split(',')
                                : [],
                            // opens: $scope.provider.provider_openTime,
                            // closes: $scope.provider.provider_closeTime,
                        },
                    ],
                })
                if ($scope.service) {
                    script.priceRange = `$${$scope.service.priceRange || $scope.service.price}`
                }
                document.head.appendChild(script)
            }

            function showOtherInfo() {
                const languages = $scope.staffList.map(staff => staff.staff_language).filter(s => s)
                const unique_languages = _.uniq(languages.join().split(',')).join()

                $scope.provider.unique_languages = unique_languages
                $scope.show_other_info =
                    unique_languages || $scope.provider.provider_yearsOfExperience
            }

            async function getProviderData(provider_ID) {
                const [provider] = await Promise.all([
                    ListServices.findProvider(provider_ID),
                    $scope.getStaffList(provider_ID),
                ])
                $scope.providerInfo = provider.data[0]
                $scope.provider = $scope.providerInfo
                showOtherInfo()
                createDynamicProviderDescription()

                if ($scope.user.ID == $scope.provider.provider_ID && !$scope.has_services) {
                    $scope.showProviderBanner = true
                }

                $scope.geoPoints = {
                    lat: $scope.provider.provider_latitude,
                    lng: $scope.provider.provider_longitude,
                }
                $scope.placeToCenter =
                    $scope.provider.provider_Street +
                    ', ' +
                    $scope.provider.provider_City +
                    ' ' +
                    $scope.provider.provider_State
                $scope.titleDataMap = $scope.provider.provider_Name
                $scope.description = $scope.provider.provider_Description
                var continue_ = true
                if ($scope.providerInfo.provider_daysServicesprovider != undefined) {
                    $scope.providerInfo.provider_daysServicesprovider
                        .split(',')
                        .forEach(function(days_) {
                            if (continue_) {
                                if (
                                    new Date()
                                        .toLocaleString('en-us', { weekday: 'long' })
                                        .toUpperCase() == days_
                                ) {
                                    $scope.isOpen = 'OPEN'
                                    continue_ = false
                                }
                            }
                        })
                }

                // $scope.getAirbnbData(
                //     $scope.providerInfo.provider_City,
                //     $scope.providerInfo.provider_State,
                //     $scope.providerInfo.provider_Country
                // )
            }

            $scope.loadUrlData = async function() {
                $scope.providerImages = []
                $scope.servicesList = []
                $scope.servicesImageList = []
                $scope.carruselImageList = []
                $scope.staffList = []
                $scope.reviewsInfoData = []
                $scope.airbnbInfoData = []
                $scope.serviceOptions = []
                const language = $route.current.params.language

                if (window.location.href.includes('hospitalID')) {
                    $scope.hospitalId = $route.current.params.hospitalID
                    const all_provider_services_list = await getAllProviderServices(
                        $scope.hospitalId
                    )
                    const all_services = Object.values(all_provider_services_list).flat()

                    $scope.procedure_price_by_provider = all_services.map(p => {
                        return {
                            provider_ID: +$scope.hospitalId,
                            procedure_ID: p.procedure_ID,
                            procedure_Name: p.procedure_Name,
                            price: p.servicePrice,
                            service_consultationCost: p.service_consultationCost,
                            service_ID: p.service_ID,
                            service_PriceFactor: p.service_PriceFactor,
                        }
                    })

                    $scope.servicesList = all_provider_services_list
                    $scope.has_services = Object.keys(all_provider_services_list).length
                    if ($scope.has_services) {
                        $scope.categories_by_provider = _.uniq(
                            Object.keys(all_provider_services_list)
                                .map(cat => {
                                    return all_provider_services_list[cat]
                                })
                                .flat()
                                .map(service => {
                                    return service.category_Name
                                })
                        )
                    }
                    getServicesImageCSS($scope.hospitalId)

                    await getProviderData($scope.hospitalId)

                    getReviewsAverage($scope.hospitalId)
                    getAllReviewsData($scope.hospitalId)

                    if (window.location.href.includes('procedure')) {
                        var urlParamProcedure = $route.current.params.procedure
                    }
                    if (urlParamProcedure !== undefined) {
                        // $scope.servicesList = all_provider_services_list.filter(
                        //     s => s.procedure_ID != urlParamProcedure
                        // )

                        ListServices.findServiceByProvider(
                            $scope.hospitalId,
                            urlParamProcedure,
                            language
                        ).then(async function(service) {
                            if (service.data.length == 0) {
                                showToastMsg(
                                    $scope.setLanguage == 'SP'
                                        ? 'Servicio no encontrado. IntÃ©ntalo de nuevo'
                                        : 'Service not found. please try again',
                                    'ERROR'
                                )
                            } else {
                                $scope.service = service.data[0]

                                setPageAttributes()

                                const {
                                    data: documentsData,
                                } = await ServiceServices.getAllDocumentsRequiredByServiceId(
                                    service.data[0].service_ID
                                )
                                $scope.requiredDocuments = documentsData

                                const {
                                    data: brandList,
                                } = await BrandServices.getSelectedProcedureBrands({
                                    service_ID: service.data[0].service_ID,
                                })
                                $scope.service_brands = brandList
                            }
                        })
                    } else {
                        setPageAttributes()
                    }
                } else {
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
                            window.location.href = 'index.html'
                        })
                }
            }
            $scope.loadUrlData()

            $scope.sendMessage = function(selectedService, user) {
                selectedService.messageType = 'Message'
                if (!$scope.user.ID) {
                    showToastMsg('MyMedQ_MSG.List.NeedLogIngE1', 'ERROR')
                } else if (user.ID == selectedService.provider_ID) {
                    showToastMsg('MyMedQ_MSG.List.NeedLogIngE2', 'ERROR')
                } else if (user.profileType == 'Provider') {
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

            $scope.goToService = function(provider_ID, procedure_ID) {
                const has_url_language = $route.current.params.language
                    ? `/${$route.current.params.language}`
                    : ''
                window.location = `${has_url_language}/service_details?hospitalID=${provider_ID}&procedure=${procedure_ID}`
            }

            /**
             * @author Jorge Medina
             */
            function getAllReviewsData(urlParam) {
                ListServices.findAllReviewsByProviderId(urlParam)
                    .then(function(reviewsData) {
                        $scope.reviewsInfoData = reviewsData.data
                        $scope.setReviewsPagination(reviewsData.data)
                    })
                    .catch(function(err2) {
                        showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                        console.log('Get All Review Error :: ' + err2)
                    })
            }

            $scope.numResultPerPages = 4
            $scope.currentPage = 0
            $scope.pageSize = 4
            $scope.numberOfPages = function() {
                return Math.ceil($scope.reviewsInfoData.length / $scope.pageSize)
            }

            $scope.setReviewsPagination = function(reviews_list) {
                if (reviews_list.length > 0) {
                    $scope.reviewsInfoDataShown = reviews_list.slice(
                        $scope.currentPage * $scope.pageSize,
                        ($scope.currentPage + 1) * $scope.pageSize
                    )
                } else {
                    //showToastMsg( 'MyMedQ_MSG.List.ServicesNFE1',"INFO")
                    $scope.reviewsInfoDataShown = []
                }
            }

            $scope.selectNextBack = function(option) {
                if (option == 'N') {
                    if ($scope.reviewsInfoData.length > $scope.pageSize) {
                        $scope.currentPage++
                    }
                } else {
                    if ($scope.currentPage != 0) {
                        $scope.currentPage--
                    }
                }
                $scope.reviewsInfoDataShown = $scope.reviewsInfoData.slice(
                    $scope.currentPage * $scope.pageSize,
                    ($scope.currentPage + 1) * $scope.pageSize
                )
            }

            /**
             * @author Jorge Medina
             */
            $scope.showMenu = function(ev, data_, indice) {
                $scope.ContentPDF = true
                const name = data_.attachments_name.replace('MedQIMG_', '')
                $scope.shown_document = `https://mymedquest.s3.us-east-2.amazonaws.com/staff/provider_${$scope.provider.provider_ID}/${name}`
                $mdDialog.show({
                    contentElement: '#myDialog',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                })
                return
                if (data_ != null) {
                    var currentBlob = new Blob([base64ToUint8Array(data_)], {
                        type: 'application/pdf',
                    })
                    var documentViwerData = URL.createObjectURL(currentBlob)
                    $scope.ContentPDF = $sce.trustAsResourceUrl(documentViwerData)

                    $mdDialog.show({
                        contentElement: '#myDialog',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                    })
                }
            }

            /**
             * @author Jorge Medina
             */
            $scope.writeReview = async function() {
                if ($scope.reviewsObj == undefined) {
                    showToastMsg('MyMedQ_MSG.ListDetail.TypeTheRequeE1', 'INFO')
                    return
                } else if ($scope.reviewsObj.provider_review_userWhoWrite.trim() == '') {
                    showToastMsg('MyMedQ_MSG.ListDetail.TypeTheRequeE2', 'INFO')
                    return
                } else if ($scope.reviewsObj.provider_review_description == undefined) {
                    showToastMsg('MyMedQ_MSG.ListDetail.TypeTheRequeE6', 'INFO')
                    return
                } else if ($scope.reviewsObj.provider_review_score == undefined) {
                    showToastMsg('MyMedQ_MSG.ListDetail.TypeTheRequeE7', 'INFO')
                    return
                }

                $scope.reviewsObj.provider_ID = $scope.hospitalId
                $scope.reviewsObj.providers_staff_ID = null
                $scope.reviewsObj.provider_review_status = 1

                makeReview($scope.reviewsObj)
            }

            /**
             * @author Jorge Medina
             */
            function makeReview(reviewsObj) {
                ListServices.createReview(reviewsObj)
                    .then(function(reviewSavedId) {
                        if (reviewSavedId.data.status > 0) {
                            showToastMsg('Review Successfully Saved', 'SUCCESS')
                            $scope.reviewsObj = {}
                            getReviewsAverage($scope.hospitalId)
                            getAllReviewsData($scope.hospitalId)
                        } else {
                            showToastMsg('MyMedQ_MSG.ListDetail.ErrorSavindRDataE1', 'ERROR')
                            return false
                        }
                    })
                    .catch(function(err) {
                        showToastMsg('MyMedQ_MSG.ListDetail.ErrorSavindRDataE1.2.', 'ERROR')
                        console.log('Making Review Error :: ' + err)
                        return false
                    })
                return true
            }

            /**
             * @author Jorge Medina
             */
            $scope.doIndividualQualification = function(staffId) {
                new Promise(function(resolve, reject) {
                    $scope.reviewsObj = {}
                    $scope.reviewsObj.provider_review_score = $scope.overStar
                    $scope.reviewsObj.provider_ID = $scope.hospitalId
                    $scope.reviewsObj.providers_staff_ID = staffId
                    $scope.reviewsObj.provider_review_status = 1

                    if (makeReview($scope.reviewsObj)) {
                        resolve(true)
                    }
                })
                    .then(function(result) {
                        if (result) {
                            console.log('Review correctly made')
                        }
                        return result
                    })
                    .catch(function(err) {
                        showToastMsg('MyMedQ_MSG.ListDetail.ErrorSavindRDataE1.3', 'ERROR')
                        console.log('Unexpected Error :: ' + err)
                        return false
                    })
            }

            /**
             * @author Jorge Medina
             */
            $scope.hoveringOver = function(value) {
                $scope.overStar = value
                $scope.percent = 100 * (value / $scope.max)
            }

            /**
             * @author Jorge Medina
             */
            function base64ToUint8Array(base64str) {
                var binary = atob(base64str.replace(/\s/g, ''))
                var len = binary.length
                var buffer = new ArrayBuffer(len)
                var view = new Uint8Array(buffer)
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i)
                }
                return view
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
        },
    ],
})
