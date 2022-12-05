'use strict';

angular.
  module('indexModule').
  component('indexModule', {
    templateUrl: './app/index/index.template.html',
    controller: ['IndexServices',
      function IndexController(IndexServices) {
        this.selectedProcedureId = null
        this.categoryList = []
        this.contactInfoObj = {}
        this.captchaResponse = undefined
        this.user = {}
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

        const indexController = this

        IndexServices
            .getListCategories()
            .then(function(categoryList) {
                this.categoryList = categoryList.data
            })
            .catch(angular.noop)

        IndexServices
            .getCustomerPreferredLanguage()
            .then(function(lang) {
                if (lang.data != undefined) {
                    this.changeLanguage(lang.data)
                }
            })
            .catch(angular.noop)

        this.changeLanguage = function(lang) {
            if (lang != undefined) {
                if (lang.length != 0) {
                    $translate.use(lang)
                    IndexServices
                        .setCustomerPreferredLanguage(lang)
                        .then(function(lang) {})
                        .catch(angular.noop)
                }
            }
        }

        this.toggleLeft = buildToggler('right')

        this.processSearch = function() {
            this.location = this.location || 'undefined'
            this.procedure =
                this.procedure == undefined
                    ? 0
                    : this.procedure == -1
                    ? 0
                    : this.procedure
            this.category = this.category == undefined ? 0 : this.category
            this.selectSpeciality =
                this.selectSpeciality == undefined ? 0 : this.selectSpeciality
            this.freeDescription = this.freeDescription || 'undefined'
            location.href =
                '/list_procedures?procedure=' +
                this.procedure +
                '&location=' +
                this.location +
                '&category=' +
                this.category +
                '&speciality=' +
                this.selectSpeciality +
                '&country=' +
                this.freeDescription
        }

        this.processInfoSearch = function(procedure_id) {
            location.href = '/procedure-description?procedure-id=' + procedure_id.value
        }

        this.dropDownSearch = function(item) {
            location.href =
                '/list_procedures?procedure=' +
                item.value +
                '&location=undefined&category=0&speciality=0&country=undefined'
        }

        // validateParamTo_()

        // function getUser() {
        //     loginManager
        //         .getUserProfile()
        //         .then(function(userData) {
        //             //user exists
        //             if (userData.data.username !== undefined) {
        //                 this.user.username = userData.data.username
        //                 this.user.name = userData.data.name
        //                 this.user.email = userData.data.email
        //                 this.user.phone = userData.data.phone
        //                 this.user.profileId = userData.data.profile
        //                 this.user.ID = userData.data.id
        //                 this.user.uniqueID = userData.data.uniqueId
        //                 this.user.profileType = userData.data.profileType
        //                 this.user.loggedIn = true
        //             } else {
        //                 this.user.loggedIn = false
        //             }
        //         })
        //         .catch(angular.noop)
        // }

        // getUser()
        getMInfo()

        function getMInfo() {
            IndexServices
                .getMyMedQuestInf0()
                .then(function(info_) {
                    this.mymedQuestInfo = info_
                })
                .catch(angular.noop)
        }

 
   
        ;(async function getFeaturedClinics() {
            const featured_clinics = await IndexServices.getFeaturedClinics()
            indexController.featured_clinics = featured_clinics.data
        })()

        this.getProceduresMatches = function() {
            return new Promise(function(resolve, reject) {
                var resultList = []
                IndexServices
                    .getProcedures('MMEDQ1_ALLC*#_.')
                    .then(function(autocompleteResult) {
                        this.resultListProcedure = []
                        this.resultListProcedure.push({ label: 'All', value: -1 })

                        if (autocompleteResult.data.length != 0) {
                            autocompleteResult.data.forEach(function(queryResult) {
                                this.resultListProcedure.push({
                                    label: queryResult.procedure_Name,
                                    value: queryResult.procedure_ID,
                                })
                            })
                        }
                        resolve(this.resultListProcedure)
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
            this.resultListCategories = []
            if (specialtyId == -1) {
                this.isSpecialitySearch = false
                this.isCategorySearch = false
                this.getMainCategoryMatchesAll()
                this.getProceduresMatches()
            } else {
                new Promise(function(resolve, reject) {
                    IndexServices
                        .getSubCategorisByMaincategory(specialtyId)
                        .then(function(autocompleteResult) {
                            this.resultListCategories.push({ label: 'All', value: -1 })
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    this.resultListCategories.push({
                                        label: queryResult.category_Name,
                                        value: queryResult.category_ID,
                                    })
                                })
                            }
                            resolve(this.resultListCategories)
                        })
                        .catch(angular.noop)
                })
                    .then(function(resultListCategories) {
                        this.isSpecialitySearch = true
                        return resultListCategories
                    })
                    .catch(function(err) {
                        console.log('Unexpected Errr : ' + '  ' + err)
                    })
            }
        }

        this.fillProcedureByCategory = function(categoryId) {
            this.resultListProcedure = []
            if (categoryId == -1) {
                this.isCategorySearch = false
                this.getProceduresMatches()
            } else {
                new Promise(function(resolve, reject) {
                    IndexServices
                        .getProceduresByCategoryIdV2(categoryId)
                        .then(function(autocompleteResult) {
                            this.resultListProcedure.push({ label: 'All', value: -1 })
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    this.resultListProcedure.push({
                                        label: queryResult.procedure_Name,
                                        value: queryResult.procedure_ID,
                                    })
                                })
                            }
                            resolve(this.resultListCategories)
                        })
                        .catch(angular.noop)
                })
                    .then(function(resultListProcedure) {
                        this.isCategorySearch = true
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
                IndexServices
                    .getCategories(categorySearch)
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
            if (this.isSpecialitySearch == false) {
                this.resultListCategories = []
                new Promise(function(resolve, reject) {
                    IndexServices
                        .getCategories('MMEDQ1_ALLC*#_.')
                        .then(function(autocompleteResult) {
                            this.resultListCategories.push({ label: 'All', value: -1 })
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    this.resultListCategories.push({
                                        label: queryResult.category_Name,
                                        value: queryResult.category_ID,
                                    })
                                })
                            }
                            resolve(this.resultListCategories)
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
            this.resultListMainCategories = []
            new Promise(function(resolve, reject) {
                IndexServices
                    .getMainCategories()
                    .then(function(autocompleteResult) {
                        this.resultListMainCategories.push({ label: 'All', value: -1 })
                        if (autocompleteResult.data.length != 0) {
                            autocompleteResult.data.forEach(function(queryResult) {
                                this.resultListMainCategories.push({
                                    label: queryResult.category_Name,
                                    value: queryResult.category_ID,
                                })
                            })
                        }
                        resolve(this.resultListMainCategories)
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

        this.sendContactUsInfo = function() {
            if (this.captchaResponse !== undefined) {
                IndexServices
                    .sendContactInfo(
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

        this.cbExpiration = function() {
            console.log('Captcha Error.')
            showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
            this.captchaResponse = undefined
        }

        function showToastMsg(msg, type) {
            if (msg != undefined) {
                //Materialize.toast(msg,15000, type == 'ERROR'?'deep-orange':(type == 'SUCCESS'?'green':'blue') );
                $translate(msg).then(function(translatedValue) {
                    Materialize.toast(
                        translatedValue,
                        15000,
                        type == 'ERROR'
                            ? 'errorMessageMedQuest_'
                            : type == 'SUCCESS'
                            ? 'successMessageMedQuest_'
                            : 'infoMessageMedQuest_'
                    )
                })
            }
        }

        // function validateParamTo_() {
        //     IndexServices
        //         .getBannerInfoByMenu('index')
        //         .then(function(autInfo) {
        //             this.infoBannerMenu_provider = []
        //             this.infoBannerMenu_user = []
        //             if (autInfo.data != '') {
        //                 autInfo.data.provider.forEach(function(url_) {
        //                     if (url_ != '') {
        //                         this.infoBannerMenu_provider.push(url_)
        //                     }
        //                 })
        //                 autInfo.data.user.forEach(function(url_) {
        //                     if (url_ != '') {
        //                         this.infoBannerMenu_user.push(url_)
        //                     }
        //                 })
        //             }
        //         })
        //         .catch(function(err) {
        //             console.log('Unexpected Err4r : ' + '  ' + JSON.stringify(err) + '  ')
        //             this.infoBannerMenu_provider = []
        //             this.infoBannerMenu_user = []
        //         })
        // }

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
    }]
     
  })
// .directive('autoCompleteProcedure', function(IndexServices) {
//     return {
//         restrict: 'A',
//         link: function(scope, elem, attr, ctrl) {
//             elem.autocomplete({
//                 source: function(searchTerm, response) {
//                     IndexServices
//                         .getProcedures(searchTerm.term)
//                         .then(function(autocompleteResult) {
//                             response(
//                                 $.map(autocompleteResult.data, function(autocompleteResult) {
//                                     return {
//                                         label: autocompleteResult['procedure_Name'],
//                                         value: autocompleteResult['procedure_ID'],
//                                     }
//                                 })
//                             )
//                         })
//                         .catch(angular.noop)
//                 },
//                 minLength: 3,
//                 select: function(event, selectedItem) {
//                     // Do something with the selected item, e.g.
//                     scope.procedure = selectedItem.item.label
//                     scope.selectedProcedureId = selectedItem.item.value
//                     scope.$apply()
//                     event.preventDefault()
//                 },
//             })
//         },
//     }
// })
// .directive('autoCompleteLocation', function(IndexServices) {
//     return {
//         restrict: 'A',
//         link: function(scope, elem, attr, ctrl) {
//             elem.autocomplete({
//                 source: function(searchTerm, response) {
//                     mainManager
//                         .getLocations(searchTerm.term)
//                         .then(function(autocompleteResult) {
//                             if (autocompleteResult.data[0].length != 0) {
//                                 response(
//                                     $.map(autocompleteResult.data[0], function(
//                                         autocompleteResult
//                                     ) {
//                                         return {
//                                             label:
//                                                 autocompleteResult['provider_City'] ||
//                                                 autocompleteResult['provider_Country'],
//                                             value:
//                                                 autocompleteResult['provider_City'] ||
//                                                 autocompleteResult['provider_Country'],
//                                         }
//                                     })
//                                 )
//                             } else if (autocompleteResult.data[1].length != 0) {
//                                 response(
//                                     $.map(autocompleteResult.data[1], function(
//                                         autocompleteResult
//                                     ) {
//                                         return {
//                                             label:
//                                                 autocompleteResult['provider_Country'] ||
//                                                 autocompleteResult['provider_City'],
//                                             value:
//                                                 autocompleteResult['provider_Country'] ||
//                                                 autocompleteResult['provider_City'],
//                                         }
//                                     })
//                                 )
//                             }
//                         })
//                         .catch(angular.noop)
//                 },
//                 minLength: 3,
//                 select: function(event, selectedItem) {
//                     // Do something with the selected item, e.g.
//                     scope.location = selectedItem.item.label
//                     scope.selectedLocation = selectedItem.item.value
//                     scope.$apply()
//                     event.preventDefault()
//                 },
//             })
//         },
//     }
// })
// .filter('trustAsResourceUrl', [
//     '$sce',
//     function($sce) {
//         return function(val) {
//             return $sce.trustAsResourceUrl(val)
//         }
//     },
// ])

