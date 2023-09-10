'use strict'

angular.module('indexModule').component('indexModule', {
    templateUrl: './app/index/index.template.html',
    controller: [
        'IndexServices',
        'GlobalServices',
        '$rootScope',
        '$translate',
        '$location',
        function IndexController(IndexServices, GlobalServices, $rootScope, $translate, $location) {
            this.selectedProcedureId = null
            this.categoryList = []
            this.contactInfoObj = {}
            this.captchaResponse = undefined
            this.user = $rootScope.user
            this.selectedProcedureItem
            this.selectedLocationItem
            this.selectedCategory
            this.selectSpeciality = undefined
            this.selectProcedure
            this.base_text = ''

            this.curentDate = new Date()
            this.mymedQuestInfo = {}

            this.resultListCategories = undefined
            this.resultListMainCategories = undefined
            this.resultListProcedure = []

            this.procedure = undefined
            this.freeDescription = undefined

            this.isSpecialitySearch = false
            this.isCategorySearch = false

            this.rcaptchaK = {}

            this.infoBannerMenu_provider = []
            this.infoBannerMenu_user = []

            this.featured_clinics = []

            this.register_and_schedule_consultation_users_url = ''
            this.adding_procedures_provider_url = ''

            const indexController = this
            const showToastMsg = GlobalServices.showToastMsg

            IndexServices.getListCategories()
                .then(function(categoryList) {
                    indexController.categoryList = categoryList.data
                })
                .catch(angular.noop)

            this.changeLanguage = function(lang) {
                if (lang != undefined) {
                    if (lang.length != 0) {
                        $translate.use(lang)
                        IndexServices.setCustomerPreferredLanguage(lang)
                            .then(function(lang) {
                                loadYoutubeVideos()
                            })
                            .catch(angular.noop)
                    }
                }
            }

            // this.changeLanguage('en') //todo: load in spanish or english

            async function loadYoutubeVideos() {
                const [
                    register_and_schedule_consultation_users_url,
                    adding_procedures_provider_url,
                ] = await Promise.all([
                    GlobalServices.getTranslation(
                        'YoutubeVideos.RegisterAndScheduleConsultationUsers'
                    ),
                    GlobalServices.getTranslation('YoutubeVideos.AddingProceduresProvider'),
                ])
                indexController.register_and_schedule_consultation_users_url = register_and_schedule_consultation_users_url
                indexController.adding_procedures_provider_url = adding_procedures_provider_url
            }

            this.processInfoSearch = function(procedure_id) {
                $location.path(`/procedure-description/${procedure_id.value}`)
            }

            validateParamTo_()

            getMInfo()

            function getMInfo() {
                GlobalServices.getMyMedQuestInf0()
                    .then(function(info_) {
                        indexController.mymedQuestInfo = info_
                    })
                    .catch(angular.noop)
            }

            ;(async function getFeaturedClinics() {
                const featured_clinics_data = await IndexServices.getFeaturedClinics()
                indexController.featured_clinics = featured_clinics_data.data.featured_clinics
                indexController.featured_clinics_average_price =
                    featured_clinics_data.data.featured_clinics_average_price
            })()

            this.getProceduresMatches = function() {
                return new Promise(function(resolve, reject) {
                    var resultList = []
                    IndexServices.getProcedures('MMEDQ1_ALLC*#_.')
                        .then(function(autocompleteResult) {
                            indexController.resultListProcedure = []
                            indexController.resultListProcedure.push({ label: 'All', value: -1 })

                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    indexController.resultListProcedure.push({
                                        label: queryResult.procedure_Name,
                                        value: queryResult.procedure_ID,
                                    })
                                })
                            }
                            resolve(indexController.resultListProcedure)
                        })
                        .catch(angular.noop)
                })
                    .then(function(resultList1) {
                        return resultList1
                    })
                    .catch(function(err) {
                        console.log('Unexpected Errr : ' + '  ' + err)
                    })
            }

            this.fillCategoryBySpeciality = function(specialtyId) {
                indexController.resultListCategories = []
                if (specialtyId == -1) {
                    indexController.isSpecialitySearch = false
                    indexController.isCategorySearch = false
                    indexController.getMainCategoryMatchesAll()
                    indexController.getProceduresMatches()
                } else {
                    new Promise(function(resolve, reject) {
                        IndexServices.getSubCategorisByMaincategory(specialtyId)
                            .then(function(autocompleteResult) {
                                indexController.resultListCategories.push({
                                    label: 'All',
                                    value: -1,
                                })
                                if (autocompleteResult.data.length != 0) {
                                    autocompleteResult.data.forEach(function(queryResult) {
                                        indexController.resultListCategories.push({
                                            label: queryResult.category_Name,
                                            value: queryResult.category_ID,
                                        })
                                    })
                                }
                                resolve(indexController.resultListCategories)
                            })
                            .catch(angular.noop)
                    })
                        .then(function(resultListCategories) {
                            indexController.isSpecialitySearch = true
                            return resultListCategories
                        })
                        .catch(function(err) {
                            console.log('Unexpected Errr : ' + '  ' + err)
                        })
                }
            }

            this.fillProcedureByCategory = function(categoryId) {
                indexController.resultListProcedure = []
                if (categoryId == -1) {
                    indexController.isCategorySearch = false
                    indexController.getProceduresMatches()
                } else {
                    new Promise(function(resolve, reject) {
                        IndexServices.getProceduresByCategoryIdV2(categoryId)
                            .then(function(autocompleteResult) {
                                indexController.resultListProcedure.push({
                                    label: 'All',
                                    value: -1,
                                })
                                if (autocompleteResult.data.length != 0) {
                                    autocompleteResult.data.forEach(function(queryResult) {
                                        indexController.resultListProcedure.push({
                                            label: queryResult.procedure_Name,
                                            value: queryResult.procedure_ID,
                                        })
                                    })
                                }
                                resolve(indexController.resultListCategories)
                            })
                            .catch(angular.noop)
                    })
                        .then(function(resultListProcedure) {
                            indexController.isCategorySearch = true
                            return resultListProcedure
                        })
                        .catch(function(err) {
                            console.log('Unexpected Errr : ' + '  ' + err)
                        })
                }
            }

            this.getCategoryMatches = function(categorySearch) {
                return new Promise(function(resolve, reject) {
                    var resultList = []
                    IndexServices.getCategories(categorySearch)
                        .then(function(autocompleteResult) {
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    resultList.push({
                                        label: queryResult.category_Name,
                                        value: queryResult.category_ID,
                                    })
                                })
                            }
                            resolve(resultList)
                        })
                        .catch(angular.noop)
                })
                    .then(function(resultList1) {
                        return resultList1
                    })
                    .catch(function(err) {
                        console.log('Unexpected Errr : ' + '  ' + err)
                    })
            }

            this.getMainCategoryMatchesAll = function() {
                if (indexController.isSpecialitySearch == false) {
                    indexController.resultListCategories = []
                    new Promise(function(resolve, reject) {
                        IndexServices.getCategories('MMEDQ1_ALLC*#_.')
                            .then(function(autocompleteResult) {
                                indexController.resultListCategories.push({
                                    label: 'All',
                                    value: -1,
                                })
                                if (autocompleteResult.data.length != 0) {
                                    autocompleteResult.data.forEach(function(queryResult) {
                                        indexController.resultListCategories.push({
                                            label: queryResult.category_Name,
                                            value: queryResult.category_ID,
                                        })
                                    })
                                }
                                resolve(indexController.resultListCategories)
                            })
                            .catch(angular.noop)
                    })
                        .then(function(resultListCategories) {
                            return resultListCategories
                        })
                        .catch(function(err) {
                            console.log('Unexpected Errr : ' + '  ' + err)
                        })
                }
            }

            this.getMainCategoryMatches = function() {
                indexController.resultListMainCategories = []
                new Promise(function(resolve, reject) {
                    IndexServices.getMainCategories()
                        .then(function(autocompleteResult) {
                            indexController.resultListMainCategories.push({
                                label: 'All',
                                value: -1,
                            })
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    indexController.resultListMainCategories.push({
                                        label: queryResult.category_Name,
                                        value: queryResult.category_ID,
                                    })
                                })
                            }
                            resolve(indexController.resultListMainCategories)
                        })
                        .catch(angular.noop)
                })
                    .then(function(resultListMainCategories) {
                        return resultListMainCategories
                    })
                    .catch(function(err) {
                        console.log('Unexpected Errr : ' + '  ' + err)
                    })
            }

            // setTimeout(async () => {
            //     let translatedValue = await $translate('Index.Home.BannerMainRotating').catch(
            //         err => msg
            //     )
            //     const [base_text, rotating_text] = translatedValue.split('*')
            //     const texts = rotating_text.split(' ')
            //     this.base_text = base_text
            //     typeText(texts)
            // }, 100)

            var index = 0

            function typeText(words) {
                var word = words[index]
                var letters = word.split('')
                var i = 0
                var interval = setInterval(function() {
                    var letter = letters[i]
                    var text = document.getElementById('dynamic-header').innerHTML
                    document.getElementById('dynamic-header').innerHTML = text + letter

                    i++
                    if (i >= letters.length) {
                        clearInterval(interval)
                        setTimeout(() => {
                            deleteText(words)
                        }, 1000) // Wait 1 second before deleting
                    }
                }, 200) // Add one letter every 100ms
            }

            function deleteText(words) {
                var word = words[index]
                var letters = word.split('')
                var i = letters.length - 1
                var interval = setInterval(function() {
                    var text = document.getElementById('dynamic-header').innerHTML
                    document.getElementById('dynamic-header').innerHTML = text.slice(0, -1)
                    i--
                    if (i < 0) {
                        clearInterval(interval)
                        index = (index + 1) % words.length
                        setTimeout(() => {
                            typeText(words)
                        }, 1000) // Wait 1 second before typing again
                    }
                }, 50) // Delete one letter every 50ms
            }

            this.sendContactUsInfo = function() {
                if (indexController.captchaResponse !== undefined) {
                    IndexServices.contactUs(
                        indexController.contactInfoObj.contactName_,
                        indexController.contactInfoObj.contactEmail_,
                        indexController.contactInfoObj.contactPhone_,
                        indexController.contactInfoObj.information_
                    )
                        .then(function(sendObjResponse) {
                            //console.log('Response :: ' + JSON.stringify(sendObjResponse) );
                            showToastMsg('MyMedQ_MSG.ContactSucess', 'SUCCESS')
                        })
                        .catch(angular.noop)
                }
            }

            this.cbExpiration = function() {
                console.log('Captcha Error.')
                showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
                indexController.captchaResponse = undefined
            }

            async function validateParamTo_() {
                const autInfo = await GlobalServices.getBannerInfoByMenu('index')

                indexController.infoBannerMenu_provider = []
                indexController.infoBannerMenu_user = []
                if (autInfo.data != '') {
                    autInfo.data.provider.forEach(function(url_) {
                        if (url_ != '') {
                            indexController.infoBannerMenu_provider.push(url_)
                        }
                    })
                    autInfo.data.user.forEach(function(url_) {
                        if (url_ != '') {
                            indexController.infoBannerMenu_user.push(url_)
                        }
                    })
                }
            }

            this.isOpenRight = function() {
                console.log('1> ' + $mdSidenav('right').isOpen())
                console.log('2> ' + $mdSidenav('left').isOpen())
                return $mdSidenav('right').isOpen()
            }

            function buildToggler(navID) {
                return function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function() {
                            console.log('toggle ' + navID + ' is done')
                        })
                }
            }
        },
    ],
})
