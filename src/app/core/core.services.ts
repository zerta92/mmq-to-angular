//@ts-nocheck
angular.module('core.services', ['ngCookies']).factory('GlobalServices', [
    '$http',
    '$cookies',
    'ServiceManagerServices',
    '$translate',
    '$mdToast',
    function($http, $cookies, ServiceManagerServices, $translate, $mdToast) {
        return {
            showToastMsg: async function(msg, type) {
                if (msg != undefined) {
                    const translatedValue = await $translate(msg).catch(err => msg)
                    var toast = $mdToast
                        .simple()
                        .textContent(translatedValue)
                        .position('top right')
                        .hideDelay(3000)

                    $mdToast.show(toast)
                    // Materialize.toast(
                    //     translatedValue,
                    //     5000,
                    //     type == 'ERROR'
                    //         ? 'errorMessageMedQuest_'
                    //         : type == 'SUCCESS'
                    //         ? 'successMessageMedQuest_'
                    //         : 'infoMessageMedQuest_'
                    // )
                }
            },
            getGlobalEnums: function() {
                return $http.get('/api/getGlobalEnums')
            },
            getTranslation: async function(key) {
                if (key) {
                    const translatedValue = await $translate(key).catch(err => {
                        console.log(err)
                        return key
                    })

                    return translatedValue
                }
            },
            getConsultationInformation: function() {
                return $http.get('/api/providers/getConsultationInformation')
            },
            getRegistrationTerms: function() {
                return $http.get('/api/providers/getRegistrationTerms')
            },
            requestAppointment: function(service, user) {
                return $http.post('/api/services-manager/requestAppointment', [service, user])
            },
            getProcedures: function(search) {
                return $http.get('/api/AutoCompleteProcedure/' + search)
            },
            getProviderServicesGroupedByCategory: function(provider_ID) {
                return $http.post('/api/services/getProviderServicesGroupedByCategory', provider_ID)
            },
            getLocations: function(search) {
                return $http.get('/api/AutoCompleteLocation/' + search)
            },
            findProvider: function(providerId) {
                return $http.get('/api/findProvider/' + providerId)
            },
            getCategoriesListSearch: function(search) {
                return $http.get('/api/AutoCompleteCategories/' + search)
            },
            setCustomerPreferredLanguage: function(lang) {
                return $http.get('/api/setCustomerPreferredLanguage/' + lang)
            },
            getCustomerPreferredLanguage: function() {
                return $http.get('/api/getCustomerPreferredLanguage')
            },
            getMyMedQuestInf0: function() {
                return $http.get('/api/dashboard/getMyMedQuestInfo')
            },
            customerIPHandler: async function() {
                if ($cookies.getObject('client_ip') === undefined) {
                    const { data } = await $http({
                        method: 'GET',
                        url: 'https://api.ipify.org?format=json',
                    })
                    const ip = data.ip
                    $cookies.putObject('client_ip', {
                        ip,
                    })
                }
                const { ip } = $cookies.getObject('client_ip')
                await $http.post('/api/customerIPHandler', {
                    ip: ip,
                })

                return ip
            },
            checkProviderServices: function(provider_id) {
                return $http.get('/api/services/checkProviderServices/' + provider_id)
            },
            createTranslationDetails: function(textID) {
                return $http.post('/api/createTranslationDetails', textID)
            },
            updateTranslationDetail: function(todoData) {
                return $http.post('/api/updateTranslationDetail', todoData)
            },
            updateMultipleTranslationDetail: function(translations) {
                return $http.post('/api/updateMultipleTranslationDetail', translations)
            },
            findExistingTranslations: function(textID) {
                return $http.post('/api/findExistingTranslations', textID)
            },
            getTextDetailByTextID: function(id) {
                return $http.post('/api/getTextDetailByTextID/', id)
            },
            getTextsDetailsByTextIDs: function(id) {
                return $http.post('/api/getTextsDetailsByTextIDs/', id)
            },
            getMessageByAppointmentId: function(id, profileType) {
                return $http.get('/api/getMessageByAppointmentId/' + id + '/' + profileType)
            },
            userCancelAppointment: async function(appointment_data) {
                await Promise.all([
                    ServiceManagerServices.userCancelSelected(
                        appointment_data.map(a => a.message_ID)
                    ),
                    ServiceManagerServices.cancelAppointment(appointment_data),
                    ServiceManagerServices.notifyProvidersDecline(appointment_data),
                    ServiceManagerServices.userDeleteUserOptions(appointment_data),
                ])
                return
            },
            providerCancelAppointment: async function(appointment_data) {
                await Promise.all([
                    ServiceManagerServices.cancelAppointment(appointment_data),
                    ServiceManagerServices.cancelSelected(appointment_data.map(a => a.message_ID)),
                    ServiceManagerServices.notifyUsersDecline(appointment_data),
                ])
                return
            },
            userAcceptAppointment: async function(appointment_data) {
                //if confirming re schedule, appointment does not get created
                const created_appointments_result = await ServiceManagerServices.createAppointment(
                    appointment_data
                )

                const { created_appointments } = created_appointments_result.data

                const confirm_reschedule = appointment_data
                    .map(a => {
                        return {
                            created_appointment: a.related_Appointment,
                            message_id: a.message_ID,
                        }
                    })
                    .filter(a => a.created_appointment)

                const to_confirm =
                    created_appointments.length > 0 ? created_appointments : confirm_reschedule

                const is_follow_up = appointment_data[0].message_Action.status == 4

                if (to_confirm.length > 0) {
                    const is_reschedule = confirm_reschedule.length > 0
                    await ServiceManagerServices.userConfirmSelected({
                        to_confirm,
                        is_reschedule,
                        is_follow_up,
                    })
                }
                ServiceManagerServices.notifyProvidersAccept(appointment_data)
            },
            providerAcceptAppointment: async function(appointment_data) {
                await Promise.all([
                    ServiceManagerServices.confirmSelected(appointment_data),
                    ServiceManagerServices.notifyUsersConfirm(appointment_data),
                ])
            },
            translateText: function(textObj) {
                return $http.post('/api/translateText', textObj)
            },
            getUserLocation: function() {
                return $http.get('/api/getLocation')
            },
            getUserProfile: async function(token) {
                return $http.get('/api/getProfile/' + token)
            },
            setUserProfile: function(customer) {
                return $http.post('/api/setProfile', customer)
            },
            getServiceActions: function(status_text) {
                const service_status = {
                    [`Needs Action`]: 0,
                    [`Declined`]: 1,
                    [`Confirmed`]: 2,
                    [`Confirm Re-Schedule`]: 3,
                }
                return service_status[status_text]
            },
            getServiceMessageTextFromStatus: async function(status) {
                const service_status = {
                    0: 'servicesManager.needsAction',
                    1: 'servicesManager.serviceDeclined',
                    2: 'servicesManager.serviceConfirmed',
                    3: 'servicesManager.confirmReschedule',
                    4: 'servicesManager.confirmFollowUp',
                }

                const status_text = await $translate(service_status[status]).catch(
                    err => service_status[status]
                )

                return { status_text, status }
            },
            sendSlackMessage: function(slack_params) {
                return $http.post('/api/slack/sendSlackMessage', slack_params)
            },
            getUserStaffApproval: function(key) {
                return $http.post('/api/customer/staffUrlApproval', key)
            },
            increasePageViews: function(provider_id) {
                return $http.post('/api/customer/increasePageViews', provider_id)
            },
            getUrlVars: function(redirect_url) {
                var vars = {}
                if (redirect_url) {
                    return vars
                }

                window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                    vars[key] = value
                })
                return vars
            },
            getSupportedTimezones: function() {
                //https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a
                return {
                    us: {
                        Pacific: 'US/Pacific',
                        Central: 'US/Central',
                        Eastern: 'US/Eastern',
                        Hawaii: 'US/Hawaii',
                        Mountain: 'US/Mountain',
                        Alaska: 'US/Alaska',
                    },
                    mx: {
                        'America/Tijuana': 'America/Tijuana',
                        'America/Cancun': 'America/Cancun',
                        'America/Mexico_City': 'America/Mexico_City',
                        'America/Hermosillo': 'America/Hermosillo',
                    },
                    es: {
                        'Europe/Madrid': 'Europe/Madrid',
                    },
                    ca: {
                        'Canada/Atlantic': 'Canada/Atlantic',
                        'Canada/Central': 'Canada/Central',
                        'Canada/Eastern': 'Canada/Eastern',
                        'Canada/Mountain': 'Canada/Mountain',
                        'Canada/Newfoundland': 'Canada/Newfoundland',
                        'Canada/Pacific': 'Canada/Pacific',
                        'Canada/Saskatchewan': 'Canada/Saskatchewan',
                        'Canada/Yukon': 'Canada/Yukon',
                    },
                }
            },
            getSupportedCountryCodesAndStates: function() {
                return {
                    us: {
                        AL: 'Alabama',
                        AK: 'Alaska',
                        AZ: 'Arizona',
                        AR: 'Arkansas',
                        CA: 'California',
                        CO: 'Colorado',
                        CT: 'Connecticut',
                        DE: 'Delaware',
                        DC: 'District Of Columbia',
                        FL: 'Florida',
                        GA: 'Georgia',
                        HI: 'Hawaii',
                        ID: 'Idaho',
                        IL: 'Illinois',
                        IN: 'Indiana',
                        IA: 'Iowa',
                        KS: 'Kansas',
                        KY: 'Kentucky',
                        LA: 'Louisiana',
                        ME: 'Maine',
                        MD: 'Maryland',
                        MA: 'Massachusetts',
                        MI: 'Michigan',
                        MN: 'Minnesota',
                        MS: 'Mississippi',
                        MO: 'Missouri',
                        MT: 'Montana',
                        NE: 'Nebraska',
                        NV: 'Nevada',
                        NH: 'New Hampshire',
                        NJ: 'New Jersey',
                        NM: 'New Mexico',
                        NY: 'New York',
                        NC: 'North Carolina',
                        ND: 'North Dakota',
                        MP: 'Northern Mariana Islands',
                        OH: 'Ohio',
                        OK: 'Oklahoma',
                        OR: 'Oregon',
                        PA: 'Pennsylvania',
                        PR: 'Puerto Rico',
                        RI: 'Rhode Island',
                        SC: 'South Carolina',
                        SD: 'South Dakota',
                        TN: 'Tennessee',
                        TX: 'Texas',
                        UT: 'Utah',
                        VT: 'Vermont',
                        VI: 'Virgin Islands',
                        VA: 'Virginia',
                        WA: 'Washington',
                        WV: 'West Virginia',
                        WI: 'Wisconsin',
                        WY: 'Wyoming',
                    },
                    mx: {
                        'Ags.': 'Aguascalientes',
                        'B.C.': 'Baja California',
                        'B.C.S.': 'Baja California Sur',
                        'Camp.': 'Campeche',
                        'Chis.': 'Chiapas',
                        'Chih.': 'Chihuahua',
                        'Coah.': 'Coahuila',
                        'Col.': 'Colima',
                        'Dgo.': 'Durango',
                        'Gto.': 'Guanajuato',
                        'Gro.': 'Guerrero',
                        'Hgo.': 'Hidalgo',
                        'Jal.': 'Jalisco',
                        'Méx.': 'Mexico',
                        'Mich.': 'Michoacán',
                        'Mor.': 'Morelos',
                        'Nay.': 'Nayarit',
                        'N.L.': 'Nuevo Leon',
                        'Oax.': 'Oaxaca',
                        'Pue.': 'Puebla',
                        'Qro.': 'Queretaro',
                        'Q. Roo': 'Quintana Roo',
                        'S.L.P.': 'San Luis Potosi',
                        'Sin.': 'Sinaloa',
                        'Son.': 'Sonora',
                        'Tab.': 'Tabasco',
                        'Tamps.': 'Tamaulipas',
                        'Tlax.': 'Tlaxcala',
                        'Ver.': 'Veracruz',
                        'Yuc.': 'Yucatán',
                        'Zac.': 'Zacatecas',
                    },
                    es: {
                        '01': 'Andalucia',
                        '02': 'Aragon',
                        '03': 'Principado de Asturias',
                        '04': 'Illes Balears',
                        '05': 'Canarias',
                        '06': 'Cantabria',
                        '07': 'Castilla y Leon',
                        '08': 'Castilla - La Mancha',
                        '09': 'Cataluna',
                        '10': 'Comunitat Valenciana',
                        '11': 'Extremadura',
                        '12': 'Galicia',
                        '13': 'Comunidad de Madrid',
                        '14': 'Region de Murcia',
                        '15': 'Comunidad Foral de Navarra',
                        '16': 'Pais Vasco',
                        '17': 'La Rioja',
                        '18': 'Ciudad Autonoma de Ceuta',
                        '19': 'Ciudad Autonoma de Melilla',
                    },
                    ca: {
                        '01': 'Alberta',
                        '02': 'British Columbia',
                        '03': 'Manitoba',
                        '04': 'New Brunswick',
                        '05': 'Newfoundland and Labrador',
                        '06': 'Northwest Territories',
                        '07': 'Nova Scotia',
                        '08': 'Nunavut',
                        '09': 'Ontario',
                        '10': 'Prince Edward Island',
                        '11': 'Quebec',
                        '12': 'Saskatchewan',
                        '13': 'Yukon',
                    },
                }
            },
            getSupportedCountriesNames: function() {
                return ['United States', 'Mexico', 'Spain', 'Canada']
            },
            goToWithRedirect: function(go_to, redirect_url, clear_cookie = false) {
                if (clear_cookie) {
                    $cookies.remove('MyMedQuestC00Ki3', { path: '/' })
                    $cookies.remove('MyMedQuestC00Ki3', { path: '/adminMedquest' })
                }
                location.href = `/${go_to}?redirect_to=adminMedquest/${redirect_url}`
            },
            updateCustomerCookie: async function(customer) {
                const GlobalServices = this
                if (!customer) {
                    return
                }
                const new_token = await GlobalServices.setUserProfile({ customer: customer })

                if (!new_token) {
                    return
                }
                const customerData = await GlobalServices.getUserProfile(new_token.data)
                if (customerData.data.token) {
                    $cookies.putObject(
                        'MyMedQuestC00Ki3',
                        {
                            userName: customerData.data.username,
                            email: customerData.data.email,
                            profileType: customerData.data.profileType,
                            ID: customerData.data.ID,
                            token: new_token.data,
                        },
                        { path: '/' }
                    )
                }
            },
            getCustomer: async function(token, redirect_url) {
                const GlobalServices = this
                const objUrl = GlobalServices.getUrlVars(redirect_url)
                if (token) {
                    let signed_services_count
                    const userData = await GlobalServices.getUserProfile(token)

                    if (userData.data) {
                        $cookies.putObject('MyMedQuestC00Ki3', {
                            userName: userData.data.username,
                            email: userData.data.email,
                            profileType: userData.data.profileType,
                            ID: userData.data.ID,
                            token,
                        })

                        const providerServicesCheck = await GlobalServices.checkProviderServices(
                            userData.data.ID
                        )

                        if (providerServicesCheck.data.status < 0) {
                            signed_services_count = 0
                        } else {
                            signed_services_count = +providerServicesCheck.data.count.count
                        }
                        if (userData.data.profileType == 'Provider' && signed_services_count == 0) {
                            window.location.href = redirect_url || 'adminMedquest/#!/adminServices'
                        } else {
                            window.location.href = redirect_url || '/dashboard'
                        }
                    }
                } else if (Object.keys(objUrl).length > 0) {
                    //delete this?
                    // const validateUrl = function(urlParam) {
                    //     var q = $q.defer()
                    //     GlobalServices
                    //         .getUserStaffApproval(JSON.stringify(urlParam))
                    //         .then(function(approvalResponse) {
                    //             console.log({ approvalResponse })
                    //             if (approvalResponse.status == 404) {
                    //                 q.resolve(undefined)
                    //             } else {
                    //                 if (approvalResponse.status == 200) {
                    //                     q.resolve(approvalResponse)
                    //                 }
                    //             }
                    //         })
                    //         .catch(function(err) {
                    //             console.log('Error > ' + err)
                    //             q.reject(err.data)
                    //         })
                    //     return q.promise
                    // }
                    // const valdidation_url_promise = validateUrl(objUrl)
                    // valdidation_url_promise
                    //     .then(function(response_) {
                    //         if (response_ !== undefined) {
                    //             GlobalServices.showToastMsg(
                    //                 'MyMedQ_MSG.LogIn.UserCorrectlyVSuccess1',
                    //                 'SUCCESS'
                    //             )
                    //             setTimeout(function() {
                    //                 window.location.href = '/login'
                    //             }, 2000)
                    //         } else {
                    //             GlobalServices.showToastMsg(
                    //                 'MyMedQ_MSG.LogIn.ErrorValidatingKeyE1',
                    //                 'ERROR'
                    //             )
                    //         }
                    //     })
                    //     .catch(function(e) {
                    //         GlobalServices.showToastMsg('MyMedQ_MSG.AccessDenied', 'ERROR')
                    //         console.log(e)
                    //     })
                }
            },
            getClientNotifications: function(client) {
                return $http.post('/api/customer/getClientNotifications', client)
            },
            saveProfilePictureToDB: function(profilePicData) {
                return $http.post('/api/customer/saveProfilePictureToDB', profilePicData)
            },
            getUserAppointmentsDiff: function(userId, type) {
                return $http.get('/api/dashboard/getUserAppointmentsDiff/' + userId + '/' + type)
            },
            getDataUserInforDashBoard: function(profileId) {
                return $http.get(
                    '/api/dashboard/getDataReportUserConsultationNotificationByUserId/' + profileId
                )
            },
            getDataUserInforHiredServicesDashBoard: function(userId) {
                return $http.get('/api/dashboard/getDataReportHiredServicesByUserId/' + userId)
            },
            getUserAppoinments: function(providerId) {
                return $http.get('/api/dashboard/getUserAppoinments/' + providerId)
            },
            getUserMenu: function(profile_id) {
                return $http.get('/api/customer/getMenuPages/' + profile_id)
            },
            getBannerInfoByMenu: function(menu) {
                return $http.get(`/api/customer/getInfoBannerByMenu/` + menu)
            },
            getUserAppointmentsDiff: function(userId, type) {
                return $http.get('/api/dashboard/getUserAppointmentsDiff/' + userId + '/' + type)
            },
            getAllProviderMessages: function(user) {
                return $http.post('/api/getAllProviderMessages', user)
            },
            checkCurrentAppointmentRoom: function(appointment_data) {
                return $http.post('/api/twilio/checkCurrentAppointmentRoom', appointment_data)
            },
            getAllUserMessages: function(user) {
                return $http.post('/api/getAllUserMessages', user)
            },
        }
    },
])
