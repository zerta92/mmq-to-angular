'use strict'

angular.module('indexModule').component('indexModule', {
    templateUrl: './app/index/index.template.html',
    controller: [
        'IndexServices',
        'GlobalServices',
        function IndexController(IndexServices, GlobalServices) {
            this.selectedProcedureId = null
            this.categoryList = []
            this.contactInfoObj = {}
            this.captchaResponse = undefined

            this.selectedProcedureItem
            this.selectedLocationItem
            this.selectedCategory
            this.selectSpeciality = undefined
            this.selectProcedure

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

            getMInfo()
            loadYoutubeVideos()

            IndexServices.getListCategories()
                .then(function(categoryList) {
                    this.categoryList = categoryList.data
                })
                .catch(angular.noop)

            IndexServices.getCustomerPreferredLanguage()
                .then(function(lang) {
                    if (lang.data != undefined) {
                        indexController.changeLanguage(lang.data)
                    }
                })
                .catch(angular.noop)

            this.changeLanguage = function(lang) {
                if (lang != undefined) {
                    if (lang.length != 0) {
                        $translate.use(lang)
                        IndexServices.setCustomerPreferredLanguage(lang)
                            .then(function(lang) {})
                            .catch(angular.noop)
                    }
                }
            }

            this.toggleLeft = buildToggler('right')

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

            function getMInfo() {
                IndexServices.getMyMedQuestInf0()
                    .then(function(info_) {
                        this.mymedQuestInfo = info_
                    })
                    .catch(angular.noop)
            }

            ;(async function getFeaturedClinics() {
                const featured_clinics = await IndexServices.getFeaturedClinics()
                indexController.featured_clinics = featured_clinics.data
            })()

            this.sendContactUsInfo = function() {
                if (this.captchaResponse !== undefined) {
                    IndexServices.sendContactInfo(
                        this.contactInfoObj.contactName_,
                        this.contactInfoObj.contactEmail_,
                        this.contactInfoObj.contactPhone_,
                        this.contactInfoObj.information_
                    )
                        .then(function(sendObjResponse) {
                            //console.log('Response :: ' + JSON.stringify(sendObjResponse) );
                            showToastMsg('MyMedQ_MSG.ContactSucess', 'SUCCESS')
                        })
                        .catch(angular.noop)
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
