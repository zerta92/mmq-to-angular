'use strict'

angular.module('contactUsModule').component('contactUsModule', {
    templateUrl: './app/contact_us/contact_us.component.html',
    controllerAs: 'vm',
    controller: [
        'ContactUsServices',
        'GlobalServices',
        function AccountVerificationController(ContactUsServices, GlobalServices) {
            const ctrl = this
            const showToastMsg = GlobalServices.showToastMsg

            ctrl.contactInfoObj = {}
            GlobalServices.getMyMedQuestInf0().then(function(info_) {
                ctrl.mymedQuestInfo = info_
            })

            ctrl.sendContactUsInfo = function() {
                if (ctrl.captchaResponse !== undefined) {
                    ContactUsServices.sendContactInfo(
                        ctrl.contactInfoObj.contactName_,
                        ctrl.contactInfoObj.contactEmail_,
                        ctrl.contactInfoObj.contactPhone_,
                        ctrl.contactInfoObj.information_
                    ).then(function(sendObjResponse) {
                        showToastMsg('MyMedQ_MSG.ContactSucess', 'SUCCESS')
                    })
                }
            }

            ctrl.cbExpiration = function() {
                showToastMsg('MyMedQ_MSG.CaptchaCodeError1', 'ERROR')
                ctrl.captchaResponse = undefined
            }
        },
    ],
})
