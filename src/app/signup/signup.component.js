'use strict';

angular.
  module('signupModule').
  component('signupModule', {
    moduleId: module.id,
    templateUrl: './app/signup/signup.template.html',
    controller: ['SignupServices',
    'GlobalServices',
    '$mdDialog',
    '$translate',
    '$cookies',
    '$location',
      function SignupController(SignupServices, GlobalServices, $mdDialog, $translate, $cookies, $location) {
        const showToastMsg = GlobalServices.showToastMsg
        const redirect_url = $location.search().redirect_to

        this.user = {
            name: '',
            description: '',
            street: '',
            city: '',
            state: '',
            postalcode: '',
            country: this.selected_country_data ? this.selected_country_data.name : null,
            countryCode: this.selected_country_data ? this.selected_country_data.iso2 : null,
            email: '',
            username: '',
            password: '',
            profile: undefined,
            hospitalName: '',
            phone: null,
        }
        this.categoryList = []
        this.vm = {
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
        this.curentyear = new Date().getFullYear()
        this.curentDate = new Date()
        this.mymedQuestInfo = {}
        this.forgotPasswd = {}
        const search = location.search
        if (search.includes('confirmation=')) {
            this.user.confirmation = true
        }
        if (search.includes('username=')) {
            let username = location.search.slice(search.indexOf('username'), search.length)
            this.forgotPasswd.userName = username.replace('username=', '') || ''
        } else {
            this.forgotPasswd.userName = ''
        }
        this.captchaResponse = undefined
        this.captchaFPResponse = undefined
        this.processButtonClicked = false

        this.showAlert = function() {
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
                this.closeDialog = function() {
                    $mdDialog.hide()
                }
            }
        }

        /**
         * @author Jorge Medina
         */
        this.validateUserN = function() {
            SignupServices
                .validateUserName(this.forgotPasswd)
                .then(function(validateResponse) {
                    if (validateResponse.data.status == 1) {
                        // Usuario
                        this.forgotPasswd.type = 1
                    } else if (validateResponse.data.status == 0) {
                        // Provider
                        this.forgotPasswd.type = 0
                    } else if (validateResponse.data.status == -1) {
                        // Error validando el userName
                        showToastMsg('MyMedQ_MSG.LogIn.ErrorValidatingUserNE1', 'ERROR')
                        this.forgotPasswd.password = ''
                        this.forgotPasswd.userName = ''
                        return
                    }
                })
        }

        this.resetPassWd = function() {
            const search = location.search

            let key = search.slice(
                search.indexOf('authentication_key'),
                search.indexOf('type') - 1
            )
            key = key.replace('authentication_key=', '')
            let type = search.slice(search.indexOf('type'), search.indexOf('type') + 6)
            type = type.replace('type=', '')
            this.forgotPasswd.type = type
            SignupServices
                .authenticateAccountPasswordReset({
                    key: key,
                    type: type,
                    username: this.forgotPasswd.userName,
                })
                .then(function(validationStatus) {
                    if (validationStatus.data.status < 0) {
                        showToastMsg('MyMedQ_MSG.SignUp.ErrorChangingPE1', 'ERROR')
                    } else {
                        SignupServices
                            .resetPasswordByUserName(this.forgotPasswd)
                            .then(function(changeStatus) {
                                if (changeStatus.data.status == -1) {
                                    showToastMsg('MyMedQ_MSG.SignUp.ErrorChangingPE1', 'ERROR')
                                    this.forgotPasswd.password = ''
                                } else {
                                    showToastMsg(
                                        'MyMedQ_MSG.SignUp.PasswdSuccessMsg1',
                                        'SUCCESS'
                                    )
                                    setTimeout(function() {
                                        window.location.href = '/login'
                                    }, 2000)
                                }
                            })
                    }
                })
        }
        /**
         * @author Jorge Medina
         */
        this.closePopUp = function() {
            window.location.href = '/index.html'
        }

        this.countries = GlobalServices.getSupportedCountryCodesAndStates()

        SignupServices.getListCategories().then(function(categoryList) {
            this.categoryList = categoryList.data
        })

        this.cbExpiration = function() {
            showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
            this.captchaResponse = undefined
        }
        this.cbFPExpiration = function() {
            showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
            this.captchaFPResponse = undefined
        }

        this.loadTermsAndConditions = async function(ev) {
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

            this.hide = function() {
                $mdDialog.hide()
            }

            this.cancel = function() {
                $mdDialog.cancel()
            }

            this.answer = function(answer) {
                $mdDialog.hide(answer)
            }
        }

        this.confirmAccount = async function() {
            // ON PROVIDERSERVICE.JS SET DEFAULT STATUS TO 0 LINE 412
            const search = location.search
            let key = location.search.slice(
                search.indexOf('authentication_key'),
                search.indexOf('type') - 1
            )
            key = key.replace('authentication_key=', '')
            let type = location.search.slice(search.indexOf('type'), search.indexOf('type') + 6)
            type = type.replace('type=', '')
            const confirmationObj = {
                username: this.forgotPasswd.userName,
                authentication_key: key,
                type,
            }

            const confirmation_result = await SignupServices.confirmAccount(confirmationObj)

            if (confirmation_result.data.error) {
                showToastMsg('Signup.CustomerDetails.Confirmation.errorMessage', 'ERROR')
            } else {
                showToastMsg('Signup.CustomerDetails.Confirmation.successMessage', 'SUCCESS')
                const token = confirmation_result.data.token
                GlobalServices.getCustomer(token)
            }
        }
        ;(this.getLocationsAll = function() {
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
                this.locationsList = _.sortBy(resultList1, 'label')
            })
        })()

        this.querySearchLocations = function(query) {
            var results = query
                ? this.locationsList.filter(createFilterForLocations(query))
                : this.locationsList
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
            if (this.user.country.includes('Mexico')) {
                return 'Mexico'
            } else if (this.user.country.includes('spa')) {
                return 'Spain'
            }

            return country
        }

        this.processSignupForm = async function(is_invalid) {
            const ip = await GlobalServices.customerIPHandler()
            const clean_country_name = cleanCountryName(this.user.country)
       
            this.user.country = clean_country_name

            this.user.ip = ip

            const response = await this.loadTermsAndConditions()

            if (response != 'AGREE') {
                return
            }

            var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone //new Date().getTimezoneOffset() / 60
            this.user.timezone = timezone

            // if (this.captchaResponse !== undefined) {
            if (this.user.profile != undefined) {
                this.processButtonClicked = true
                if (this.user.profile == 1) {
                    this.user.name = this.user.firstname + ' ' + this.user.lastname
                    SignupServices
                        .userSignup(this.user)
                        .then(function(signupResult) {
                            this.processButtonClicked = false
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
                                    userName: this.user.username,
                                    email: this.user.email,
                                    profileType: 'User',
                                    token: signupResult.data.token,
                                })
                                setTimeout(function() {
                                    window.location.href = redirect_url || '/login'
                                }, 2000)
                            }
                        })
                        .catch(err => {
                            this.processButtonClicked = false
                        })
                }
                //provider
                if (this.user.profile == 0) {
                    this.user.name = this.user.hospitalName
                    SignupServices.providerSignup(this.user).then(function(signupResult) {
                        this.processButtonClicked = false
                        if (signupResult.data.status < 0) {
                            if (signupResult.data.status == -2) {
                                showToastMsg(
                                    'MyMedQ_MSG.SignUp.ProviderRegError.UsernameDuplicate',
                                    'ERROR'
                                )
                            }
                            showToastMsg('MyMedQ_MSG.SignUp.ProviderRegError', 'ERROR')
                        } else {
                            showToastMsg('MyMedQ_MSG.SignUp.ProviderRegSuccessMsg', 'SUCCESS')
                            $cookies.putObject('MyMedQuestC00Ki3', {
                                userName: this.user.username,
                                email: this.user.email,
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
      }]
  })