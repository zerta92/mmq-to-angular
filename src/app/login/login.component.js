'use strict'

angular.module('loginModule').component('loginModule', {
    templateUrl: './app/login/login.component.html',
    controller: [
        '$scope',
        'LoginServices',
        'GlobalServices',
        '$mdDialog',
        '$translate',
        '$cookies',
        '$location',
        function LoginController(
            $scope,
            LoginServices,
            GlobalServices,
            $mdDialog,
            $translate,
            $cookies,
            $location
        ) {
            const redirect_url = $location.search().redirect_to
            $scope.user = {}
            $scope.notificationMeesage = {}
            $scope.objLanguageEdit = {}
            $scope.objLanguageModel = {}
            $scope.listCategories = []
            $scope.URL = ''
            $scope.checked = true
            $scope.traslateType

            const showToastMsg = GlobalServices.showToastMsg

            if ($cookies.getObject('MyMedQuestC00Ki3')) {
                GlobalServices.getCustomer(
                    $cookies.getObject('MyMedQuestC00Ki3').token,
                    redirect_url
                )
            }

            $scope.processLoginForm = async function() {
                // const ip = await GlobalServices.customerIPHandler()
                console.log($scope.user)
                LoginServices.userLogin($scope.user)
                    .then(function(userData) {
                        if (userData.data.status < 0) {
                            showToastMsg(userData.data.message, 'ERROR')
                        } else {
                            if (
                                userData.data.user_UserName !== undefined ||
                                userData.data.provider_UserName !== undefined
                            ) {
                                window.dataLayer = window.dataLayer || []
                                dataLayer.push({
                                    event: 'formSubmission',
                                    formType: 'Sign In',
                                })
                                const token = userData.data.token
                                GlobalServices.getCustomer(token, redirect_url)
                            } else {
                                showToastMsg(userData.data.message, 'ERROR')
                            }
                        }
                    })
                    .catch(function(err) {
                        console.log('Error > ' + err)
                        showToastMsg('MyMedQ_MSG.LogIn.ErrorRequestPCE1', 'ERROR')
                    })
            }

            /**
             * @author Jorge Medina
             */
            $scope.requestPasswordC = function(ev) {
                $mdDialog
                    .show({
                        locals: {
                            traslateType: $scope.traslateType,
                        },
                        controller: dialogSuggestUsernamesController,
                        templateUrl: 'app/pages/modals/change_password_request.template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: false,
                    })
                    .then(
                        function(answer) {
                            LoginServices.getRequestForChangePasswd(
                                answer.email,
                                answer.type,
                                answer.id,
                                answer.username
                            )
                                .then(function(app) {
                                    if (app.data.status == -1) {
                                        showToastMsg('MyMedQ_MSG.LogIn.EmailNoRE1', 'ERROR')
                                    } else if (app.data.status == -2) {
                                        showToastMsg('MyMedQ_MSG.LogIn.ErrorRequestPCE1', 'ERROR')
                                    } else {
                                        showToastMsg('MyMedQ_MSG.LogIn.SuccessMsg1', 'SUCCESS')
                                    }
                                })
                                .catch(function(err) {
                                    showToastMsg('MyMedQ_MSG.LogIn.ErrorRequestPCE1', 'ERROR')
                                })
                        },
                        function() {
                            $scope.status = 'You cancelled the dialog.'
                        }
                    )

                function dialogSuggestUsernamesController($scope, $mdDialog, traslateType) {
                    $scope.userType

                    $scope.hide = function() {
                        $mdDialog.hide()
                    }

                    $scope.cancel = function() {
                        $mdDialog.cancel()
                    }

                    $scope.answer = function(answer) {
                        if (answer == 'OK' && $scope.userType != undefined) {
                            LoginServices.validateUserName($scope.userType).then(function(
                                validateResponse
                            ) {
                                if (validateResponse.data.status < 0) {
                                    showToastMsg('MyMedQ_MSG.LogIn.ErrorValidatingUserNE1', 'ERROR')
                                    $mdDialog.cancel()
                                } else {
                                    $scope.userType.id = validateResponse.data.status.split(
                                        '*&=&*'
                                    )[0]
                                    $scope.userType.email = validateResponse.data.status.split(
                                        '*&=&*'
                                    )[1]
                                    $scope.userType.username = validateResponse.data.status.split(
                                        '*&=&*'
                                    )[2]
                                    if (validateResponse.data.message == 'USER') {
                                        // Usuario
                                        $scope.userType.type = 1

                                        $mdDialog.hide($scope.userType)
                                    } else if (validateResponse.data.message == 'PROVIDER') {
                                        // Provider
                                        $scope.userType.type = 2
                                        $mdDialog.hide($scope.userType)
                                    }
                                }
                            })
                        }
                    }
                }
            }
        },
    ],
})
