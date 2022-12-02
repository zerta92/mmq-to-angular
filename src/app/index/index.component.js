'use strict';
console.log('at index component')

angular.
  module('indexModule').
  component('indexModule', {
    // moduleId: module.id,
    templateUrl: './app/index/index.template.html',
    controller: ['Index',
      function IndexController($scope, mainManager) {
        console.log(' at indexMainController')
        $scope.selectedProcedureId = null
        $scope.categoryList = []
        $scope.contactInfoObj = {}
        $scope.captchaResponse = undefined
        $scope.user = {}
        $scope.selectedProcedureItem
        $scope.selectedLocationItem
        $scope.selectedCategory
        $scope.selectSpeciality = undefined
        $scope.selectProcedure

        $scope.curentDate = new Date()
        $scope.mymedQuestInfo = {}

        $scope.resultListCategories = undefined
        $scope.resultListMainCategories = undefined
        $scope.resultListProcedure = []

        $scope.procedure = undefined
        $scope.freeDescription = undefined

        $scope.isSpecialitySearch = false
        $scope.isCategorySearch = false

        $scope.rcaptchaK = {}

        $scope.infoBannerMenu_provider = []
        $scope.infoBannerMenu_user = []

        $scope.featured_clinics = []

        mainManager
            .getListCategories()
            .then(function(categoryList) {
                $scope.categoryList = categoryList.data
            })
            .catch(angular.noop)

        mainManager
            .getCustomerPreferredLanguage()
            .then(function(lang) {
                if (lang.data != undefined) {
                    $scope.changeLanguage(lang.data)
                }
            })
            .catch(angular.noop)

        $scope.changeLanguage = function(lang) {
            if (lang != undefined) {
                if (lang.length != 0) {
                    $translate.use(lang)
                    mainManager
                        .setCustomerPreferredLanguage(lang)
                        .then(function(lang) {})
                        .catch(angular.noop)
                }
            }
        }

        $scope.toggleLeft = buildToggler('right')

        $scope.processSearch = function() {
            $scope.location = $scope.location || 'undefined'
            $scope.procedure =
                $scope.procedure == undefined
                    ? 0
                    : $scope.procedure == -1
                    ? 0
                    : $scope.procedure
            $scope.category = $scope.category == undefined ? 0 : $scope.category
            $scope.selectSpeciality =
                $scope.selectSpeciality == undefined ? 0 : $scope.selectSpeciality
            $scope.freeDescription = $scope.freeDescription || 'undefined'
            location.href =
                '/list_procedures?procedure=' +
                $scope.procedure +
                '&location=' +
                $scope.location +
                '&category=' +
                $scope.category +
                '&speciality=' +
                $scope.selectSpeciality +
                '&country=' +
                $scope.freeDescription
        }

        $scope.processInfoSearch = function(procedure_id) {
            location.href = '/procedure-description?procedure-id=' + procedure_id.value
        }

        $scope.dropDownSearch = function(item) {
            location.href =
                '/list_procedures?procedure=' +
                item.value +
                '&location=undefined&category=0&speciality=0&country=undefined'
        }

        validateParamTo_()

        // function getUser() {
        //     loginManager
        //         .getUserProfile()
        //         .then(function(userData) {
        //             //user exists
        //             if (userData.data.username !== undefined) {
        //                 $scope.user.username = userData.data.username
        //                 $scope.user.name = userData.data.name
        //                 $scope.user.email = userData.data.email
        //                 $scope.user.phone = userData.data.phone
        //                 $scope.user.profileId = userData.data.profile
        //                 $scope.user.ID = userData.data.id
        //                 $scope.user.uniqueID = userData.data.uniqueId
        //                 $scope.user.profileType = userData.data.profileType
        //                 $scope.user.loggedIn = true
        //             } else {
        //                 $scope.user.loggedIn = false
        //             }
        //         })
        //         .catch(angular.noop)
        // }

        // getUser()
        getMInfo()

        function getMInfo() {
            mainManager
                .getMyMedQuestInf0()
                .then(function(info_) {
                    $scope.mymedQuestInfo = info_
                })
                .catch(angular.noop)
        }

        /**
         * @author Jorge Medina
         */
        function getRKey() {
            mainManager
                .getRecaptchaKey()
                .then(function(info_) {
                    $scope.rcaptchaK = info_.data.MyMedQRecaptchaKey
                })
                .catch(angular.noop)
        }

        ;(async function getFeaturedClinics() {
            const featured_clinics = await mainManager.getFeaturedClinics()
            $scope.featured_clinics = featured_clinics.data
        })()

        $scope.getProceduresMatches = function() {
            return new Promise(function(resolve, reject) {
                var resultList = []
                mainManager
                    .getProcedures('MMEDQ1_ALLC*#_.')
                    .then(function(autocompleteResult) {
                        $scope.resultListProcedure = []
                        $scope.resultListProcedure.push({ label: 'All', value: -1 })

                        if (autocompleteResult.data.length != 0) {
                            autocompleteResult.data.forEach(function(queryResult) {
                                $scope.resultListProcedure.push({
                                    label: queryResult.procedure_Name,
                                    value: queryResult.procedure_ID,
                                })
                            })
                        }
                        resolve($scope.resultListProcedure)
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

        $scope.fillCategoryBySpeciality = function(specialtyId) {
            $scope.resultListCategories = []
            if (specialtyId == -1) {
                $scope.isSpecialitySearch = false
                $scope.isCategorySearch = false
                $scope.getMainCategoryMatchesAll()
                $scope.getProceduresMatches()
            } else {
                new Promise(function(resolve, reject) {
                    mainManager
                        .getSubCategorisByMaincategory(specialtyId)
                        .then(function(autocompleteResult) {
                            $scope.resultListCategories.push({ label: 'All', value: -1 })
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    $scope.resultListCategories.push({
                                        label: queryResult.category_Name,
                                        value: queryResult.category_ID,
                                    })
                                })
                            }
                            resolve($scope.resultListCategories)
                        })
                        .catch(angular.noop)
                })
                    .then(function(resultListCategories) {
                        $scope.isSpecialitySearch = true
                        return resultListCategories
                    })
                    .catch(function(err) {
                        console.log('Unexpected Errr : ' + '  ' + err)
                    })
            }
        }

        $scope.fillProcedureByCategory = function(categoryId) {
            $scope.resultListProcedure = []
            if (categoryId == -1) {
                $scope.isCategorySearch = false
                $scope.getProceduresMatches()
            } else {
                new Promise(function(resolve, reject) {
                    mainManager
                        .getProceduresByCategoryIdV2(categoryId)
                        .then(function(autocompleteResult) {
                            $scope.resultListProcedure.push({ label: 'All', value: -1 })
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    $scope.resultListProcedure.push({
                                        label: queryResult.procedure_Name,
                                        value: queryResult.procedure_ID,
                                    })
                                })
                            }
                            resolve($scope.resultListCategories)
                        })
                        .catch(angular.noop)
                })
                    .then(function(resultListProcedure) {
                        $scope.isCategorySearch = true
                        return resultListProcedure
                    })
                    .catch(function(err) {
                        console.log('Unexpected Errr : ' + '  ' + err)
                    })
            }
        }

        $scope.getCategoryMatches = function(categorySearch) {
            return new Promise(function(resolve, reject) {
                var resultList = []
                mainManager
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

        $scope.getMainCategoryMatchesAll = function() {
            if ($scope.isSpecialitySearch == false) {
                $scope.resultListCategories = []
                new Promise(function(resolve, reject) {
                    mainManager
                        .getCategories('MMEDQ1_ALLC*#_.')
                        .then(function(autocompleteResult) {
                            $scope.resultListCategories.push({ label: 'All', value: -1 })
                            if (autocompleteResult.data.length != 0) {
                                autocompleteResult.data.forEach(function(queryResult) {
                                    $scope.resultListCategories.push({
                                        label: queryResult.category_Name,
                                        value: queryResult.category_ID,
                                    })
                                })
                            }
                            resolve($scope.resultListCategories)
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

        $scope.getMainCategoryMatches = function() {
            $scope.resultListMainCategories = []
            new Promise(function(resolve, reject) {
                mainManager
                    .getMainCategories()
                    .then(function(autocompleteResult) {
                        $scope.resultListMainCategories.push({ label: 'All', value: -1 })
                        if (autocompleteResult.data.length != 0) {
                            autocompleteResult.data.forEach(function(queryResult) {
                                $scope.resultListMainCategories.push({
                                    label: queryResult.category_Name,
                                    value: queryResult.category_ID,
                                })
                            })
                        }
                        resolve($scope.resultListMainCategories)
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

        $scope.sendContactUsInfo = function() {
            if ($scope.captchaResponse !== undefined) {
                mainManager
                    .sendContactInfo(
                        $scope.contactInfoObj.contactName_,
                        $scope.contactInfoObj.contactEmail_,
                        $scope.contactInfoObj.contactPhone_,
                        $scope.contactInfoObj.information_
                    )
                    .then(function(sendObjResponse) {
                        //console.log('Response :: ' + JSON.stringify(sendObjResponse) );
                        showToastMsg('MyMedQ_MSG.ContactSucess', 'SUCCESS')
                    })
                    .catch(angular.noop)
            }
        }

        $scope.cbExpiration = function() {
            console.log('Captcha Error.')
            showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
            $scope.captchaResponse = undefined
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

        function validateParamTo_() {
            mainManager
                .getBannerInfoByMenu('index')
                .then(function(autInfo) {
                    $scope.infoBannerMenu_provider = []
                    $scope.infoBannerMenu_user = []
                    if (autInfo.data != '') {
                        autInfo.data.provider.forEach(function(url_) {
                            if (url_ != '') {
                                $scope.infoBannerMenu_provider.push(url_)
                            }
                        })
                        autInfo.data.user.forEach(function(url_) {
                            if (url_ != '') {
                                $scope.infoBannerMenu_user.push(url_)
                            }
                        })
                    }
                })
                .catch(function(err) {
                    console.log('Unexpected Err4r : ' + '  ' + err + '  ')
                    $scope.infoBannerMenu_provider = []
                    $scope.infoBannerMenu_user = []
                })
        }

        $scope.isOpenRight = function() {
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
// .directive('autoCompleteProcedure', function(mainManager) {
//     return {
//         restrict: 'A',
//         link: function(scope, elem, attr, ctrl) {
//             elem.autocomplete({
//                 source: function(searchTerm, response) {
//                     mainManager
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
// .directive('autoCompleteLocation', function(mainManager) {
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

