'use strict'

angular
    .module('signupModule')
    .directive('myPassword', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, mCtrl) {
                mCtrl.$parsers.push(function(value) {
                    var aryValue = value.split('')
                    var isChar = false,
                        isDigit = false

                    aryValue.forEach(function(element, index, array) {
                        if (Number.isInteger(parseInt(element))) {
                            isDigit = true
                        } else {
                            isChar = true
                        }
                    })

                    mCtrl.$setValidity('pass', isDigit && isChar)

                    return value
                })
            },
        }
    })
    .directive('compareTo', function() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=compareTo',
            },
            link: function(scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue
                }
                scope.$watch('otherModelValue', function() {
                    ngModel.$validate()
                })
            },
        }
    })
    .directive('validateAlphaNumeric', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attr, ngModel) {
                var validator = function(value) {
                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                        ngModel.$setValidity('alphanumeric', true)
                        return value
                    } else {
                        ngModel.$setValidity('alphanumeric', false)
                        return undefined
                    }
                }
                ngModel.$parsers.unshift(validator)
                ngModel.$formatters.unshift(validator)
            },
        }
    })
    .component('signupModule', {
        templateUrl: './app/signup/signup.component.html',
        controllerAs: 'vm',
        controller: [
            'SignupServices',
            'GlobalServices',
            '$mdDialog',
            '$translate',
            '$cookies',
            '$location',
            function SignupController(
                SignupServices,
                GlobalServices,
                $mdDialog,
                $translate,
                $cookies,
                $location
            ) {
                const showToastMsg = GlobalServices.showToastMsg
                const redirect_url = $location.search().redirect_to
                const ctrl = this
                ctrl.user = {
                    name: '',
                    description: '',
                    street: '',
                    city: '',
                    state: '',
                    postalcode: '',
                    country: null,
                    countryCode: null,
                    email: '',
                    username: '',
                    password: '',
                    profile: undefined,
                    hospitalName: '',
                    phone: null,
                }
                ctrl.categoryList = []
                ctrl.vm = {
                    signupPercentage: 0,
                    password: 0,
                    username: 0,
                    firstname: 0,
                    lastname: 0,
                    verifyPassword: 0,
                    phone: 0,
                    email: 0,
                    street: 0,
                    city: 0,
                    postalCode: 0,
                    country: 0,
                    state: 0,
                }
                ctrl.curentyear = new Date().getFullYear()
                ctrl.curentDate = new Date()
                ctrl.mymedQuestInfo = {}

                ctrl.captchaResponse = undefined
                ctrl.captchaFPResponse = undefined
                ctrl.processButtonClicked = false

                ctrl.showAlert = function() {
                    $mdDialog.show({
                        clickOutsideToClose: true,
                        template:
                            '<md-dialog aria-label="List dialog">' +
                            '  <md-dialog-content>' +
                            '	  <div class="video-container"> ' +
                            '		 <iframe src="https://www.youtube.com/embed/mhy-OS-J7hc?rel=0" frameborder="3" allowfullscreen></iframe> ' +
                            '	  </div> ' +
                            '  </md-dialog-content>' +
                            '</md-dialog>',
                        locals: {},
                        controller: DialogController,
                    })
                    function DialogController($scope, $mdDialog) {
                        ctrl.closeDialog = function() {
                            $mdDialog.hide()
                        }
                    }
                }

                ctrl.validateUserN = function() {
                    SignupServices.validateUserName(ctrl.forgotPasswd).then(function(
                        validateResponse
                    ) {
                        if (validateResponse.data.status == 1) {
                            // Usuario
                            ctrl.forgotPasswd.type = 1
                        } else if (validateResponse.data.status == 0) {
                            // Provider
                            ctrl.forgotPasswd.type = 0
                        } else if (validateResponse.data.status == -1) {
                            // Error validando el userName
                            showToastMsg('MyMedQ_MSG.LogIn.ErrorValidatingUserNE1', 'ERROR')
                            ctrl.forgotPasswd.password = ''
                            ctrl.forgotPasswd.userName = ''
                            return
                        }
                    })
                }

                ctrl.closePopUp = function() {
                    window.location.href = '/index.html'
                }

                ctrl.countries = GlobalServices.getSupportedCountryCodesAndStates()
                ctrl.supportedCountryNames = [
                    { name: 'United States', countryCode: 'us' },
                    { name: 'Mexico', countryCode: 'mx' },
                    { name: 'Spain', countryCode: 'es' },
                    { name: 'Canada', countryCode: 'ca' },
                ]

                SignupServices.getListCategories().then(function(categoryList) {
                    ctrl.categoryList = categoryList.data
                })

                ctrl.cbExpiration = function() {
                    showToastMsg('MyMedQ_MSG.CaptchacountryCodeError1', 'ERROR')
                    ctrl.captchaResponse = undefined
                }

                ctrl.loadTermsAndConditions = async function(ev) {
                    return new Promise(async function(resolve, reject) {
                        const lang = $translate.use() || 'en'
                        $mdDialog
                            .show({
                                controller: AgreeTermsController,
                                templateUrl: `/template/terms-and-conditions/termsAndConditions${lang.toUpperCase()}.html`,
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                clickOutsideToClose: true,
                                fullscreen: false,
                            })
                            .then(response => {
                                resolve(response)
                            })
                            .catch(response => {
                                resolve(response)
                            })
                    })
                }
                function AgreeTermsController($scope, $mdDialog) {
                    ctrl.hide = function() {
                        $mdDialog.hide()
                    }

                    ctrl.cancel = function() {
                        $mdDialog.cancel()
                    }

                    ctrl.answer = function(answer) {
                        $mdDialog.hide(answer)
                    }
                }

                ;(ctrl.getLocationsAll = function() {
                    return new Promise(function(resolve, reject) {
                        let resultList = []
                        GlobalServices.getLocations('ALL').then(function(allLocations) {
                            if (allLocations.data['cities'].length != 0) {
                                allLocations.data['cities'].forEach(location => {
                                    resultList.push(
                                        _.startCase(_.toLower(location.provider_City)).trim()
                                    )
                                })

                                resultList = _.uniqBy(resultList, location => {
                                    return location.toLowerCase().trim()
                                })
                            }

                            resolve(
                                resultList.map(location => {
                                    return location
                                })
                            )
                        })
                    }).then(function(resultList1) {
                        ctrl.locationsList = _.sortBy(resultList1, 'label')
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
                        const lower_case_location_name = location.toLowerCase()
                        return lower_case_location_name.includes(lowercaseQuery)
                    }
                }

                function cleanCountryName(country) {
                    if (ctrl.user.country.includes('Mexico')) {
                        return 'Mexico'
                    } else if (ctrl.user.country.includes('spa')) {
                        return 'Spain'
                    }

                    return country
                }

                ctrl.processSignupForm = async function(is_invalid) {
                    const ip = await GlobalServices.customerIPHandler()
                    const clean_country_name = cleanCountryName(ctrl.user.country)

                    ctrl.user.country = clean_country_name

                    ctrl.user.ip = ip
                    console.log(ctrl.user)
                    const response = await ctrl.loadTermsAndConditions()

                    if (response != 'AGREE') {
                        return
                    }

                    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
                    ctrl.user.timezone = timezone

                    // if (ctrl.captchaResponse !== undefined) {
                    if (ctrl.user.profile != undefined) {
                        ctrl.processButtonClicked = true
                        if (ctrl.user.profile == 1) {
                            ctrl.user.name = ctrl.user.firstname + ' ' + ctrl.user.lastname
                            SignupServices.userSignup(ctrl.user)
                                .then(function(signupResult) {
                                    ctrl.processButtonClicked = false
                                    if (signupResult.data.status < 0) {
                                        if (signupResult.data.status == -2) {
                                            showToastMsg(
                                                'MyMedQ_MSG.SignUp.UserRegError.UsernameDuplicate',
                                                'ERROR'
                                            )
                                        }
                                        showToastMsg('MyMedQ_MSG.SignUp.UserRegError', 'ERROR')
                                    } else {
                                        showToastMsg('MyMedQ_MSG.SignUp.SuccessMsg', 'SUCCESS')
                                        $cookies.putObject('MyMedQuestC00Ki3', {
                                            userName: ctrl.user.username,
                                            email: ctrl.user.email,
                                            profileType: 'User',
                                            token: signupResult.data.token,
                                        })
                                        setTimeout(function() {
                                            window.location.href = redirect_url || '/login'
                                        }, 2000)
                                    }
                                })
                                .catch(err => {
                                    ctrl.processButtonClicked = false
                                })
                        }
                        //provider
                        if (ctrl.user.profile == 0) {
                            ctrl.user.name = ctrl.user.hospitalName
                            SignupServices.providerSignup(ctrl.user).then(function(signupResult) {
                                ctrl.processButtonClicked = false
                                if (signupResult.data.status < 0) {
                                    if (signupResult.data.status == -2) {
                                        showToastMsg(
                                            'MyMedQ_MSG.SignUp.ProviderRegError.UsernameDuplicate',
                                            'ERROR'
                                        )
                                    }
                                    showToastMsg('MyMedQ_MSG.SignUp.ProviderRegError', 'ERROR')
                                } else {
                                    showToastMsg(
                                        'MyMedQ_MSG.SignUp.ProviderRegSuccessMsg',
                                        'SUCCESS'
                                    )
                                    $cookies.putObject('MyMedQuestC00Ki3', {
                                        userName: ctrl.user.username,
                                        email: ctrl.user.email,
                                        profileType: 'Provider',
                                        token: signupResult.data.token,
                                    })
                                    setTimeout(function() {
                                        window.location.href = '/login'
                                    }, 2000)
                                }
                            })
                        }
                    } else {
                        showToastMsg('MyMedQ_MSG.SignUp.MustSelectBetPOPOE1', 'ERROR')
                    }
                    //}
                }
            },
        ],
    })
