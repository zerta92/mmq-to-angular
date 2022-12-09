'use strict'

angular.module('forgotPasswordModule').component('forgotPasswordModule', {
    templateUrl: './app/forgot_password/forgot_password.component.html',
    controllerAs: 'vm',
    controller: [
        'ForgotPasswordServices',
        'GlobalServices',
        function ForgotPasswordController(ForgotPasswordServices, GlobalServices) {
            const ctrl = this
            const showToastMsg = GlobalServices.showToastMsg
            ctrl.captchaFPResponse = undefined
            ctrl.captchaResponse = undefined
            ctrl.forgotPasswd = {}
            const search = location.search
            if (search.includes('confirmation=')) {
                ctrl.user.confirmation = true
            }
            if (search.includes('username=')) {
                let username = location.search.slice(search.indexOf('username'), search.length)
                ctrl.forgotPasswd.userName = username.replace('username=', '') || ''
            } else {
                ctrl.forgotPasswd.userName = ''
            }

            ctrl.cbExpiration = function() {
                showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
                ctrl.captchaResponse = undefined
            }
            ctrl.cbFPExpiration = function() {
                showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
                ctrl.captchaFPResponse = undefined
            }

            ctrl.resetPassWd = function() {
                const search = location.search

                let key = search.slice(
                    search.indexOf('authentication_key'),
                    search.indexOf('type') - 1
                )
                key = key.replace('authentication_key=', '')
                let type = search.slice(search.indexOf('type'), search.indexOf('type') + 6)
                type = type.replace('type=', '')
                ctrl.forgotPasswd.type = type
                ForgotPasswordServices.authenticateAccountPasswordReset({
                    key: key,
                    type: type,
                    username: ctrl.forgotPasswd.userName,
                }).then(function(validationStatus) {
                    if (validationStatus.data.status < 0) {
                        showToastMsg('MyMedQ_MSG.SignUp.ErrorChangingPE1', 'ERROR')
                    } else {
                        ForgotPasswordServices.resetPasswordByUserName(ctrl.forgotPasswd).then(
                            function(changeStatus) {
                                if (changeStatus.data.status == -1) {
                                    showToastMsg('MyMedQ_MSG.SignUp.ErrorChangingPE1', 'ERROR')
                                    ctrl.forgotPasswd.password = ''
                                } else {
                                    showToastMsg('MyMedQ_MSG.SignUp.PasswdSuccessMsg1', 'SUCCESS')
                                    setTimeout(function() {
                                        window.location.href = '/login'
                                    }, 2000)
                                }
                            }
                        )
                    }
                })
            }

            ctrl.closePopUp = function() {
                window.location.href = '/index.html'
            }
        },
    ],
})
