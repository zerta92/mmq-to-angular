'use strict'

angular.module(`core.contactUs`, []).factory(`ContactUsServices`, [
    `$http`,
    function($http) {
        return {
            sendContactInfo: function(contactName, contactEmail, contactPhone, information) {
                return $http.post('/api/providers/sendGeneralInformationServices', {
                    params: {
                        contactName_: contactName,
                        contactEmail_: contactEmail,
                        contactPhone_: contactPhone,
                        information_: information,
                    },
                })
            },
        }
    },
])
