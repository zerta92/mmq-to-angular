'use strict'

angular.module('accountVerificationModule').component('accountVerificationModule', {
    templateUrl: './app/account_verification/account_verification.component.html',
    controllerAs: 'vm',
    controller: [
        'AccountVerificationServices',
        'GlobalServices',
        function AccountVerificationController(AccountVerificationServices, GlobalServices) {
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

            ctrl.confirmAccount = async function() {
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
                    username: ctrl.forgotPasswd.userName,
                    authentication_key: key,
                    type,
                }

                const confirmation_result = await AccountVerificationServices.confirmAccount(
                    confirmationObj
                )

                if (confirmation_result.data.error) {
                    showToastMsg('Signup.CustomerDetails.Confirmation.errorMessage', 'ERROR')
                } else {
                    showToastMsg('Signup.CustomerDetails.Confirmation.successMessage', 'SUCCESS')
                    const token = confirmation_result.data.token
                    GlobalServices.getCustomer(token)
                }
            }

            ctrl.closePopUp = function() {
                window.location.href = '/index.html'
            }
        },
    ],
})
