'use strict';

angular.module('core.services', ['ngCookies']).factory('GlobalServices', [
    '$http',
    '$cookies',
    // 'servicesManagerManager',
    '$translate',
    '$q',
    function($http, $cookies, /*servicesManagerManager,*/ $translate, $q) {
        return {
            showToastMsg: async function(msg, type) {
                if (msg != undefined) {
                    const translatedValue = await $translate(msg).catch(err => msg)

                    Materialize.toast(
                        translatedValue,
                        5000,
                        type == 'ERROR'
                            ? 'errorMessageMedQuest_'
                            : type == 'SUCCESS'
                            ? 'successMessageMedQuest_'
                            : 'infoMessageMedQuest_'
                    )
                }
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
            getProcedures: function(search) {
                return $http.get('/api/AutoCompleteProcedure/' + search)
            },
            getLocations: function(search) {
                return $http.get('/api/AutoCompleteLocation/' + search)
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
            getPriviligesAll: function(pageUrl) {
                return $http.get('/api/getPriviligesByUrl/' + pageUrl)
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
            // userCancelAppointment: async function(appointment_data) {
            //     await Promise.all([
            //         servicesManagerManager.userCancelSelected(
            //             appointment_data.map(a => a.message_ID)
            //         ),
            //         servicesManagerManager.cancelAppointment(appointment_data),
            //         servicesManagerManager.notifyProvidersDecline(appointment_data),
            //         servicesManagerManager.userDeleteUserOptions(appointment_data),
            //     ])
            //     return
            // },
            // providerCancelAppointment: async function(appointment_data) {
            //     await Promise.all([
            //         servicesManagerManager.cancelAppointment(appointment_data),
            //         servicesManagerManager.cancelSelected(appointment_data.map(a => a.message_ID)),
            //         servicesManagerManager.notifyUsersDecline(appointment_data),
            //     ])
            //     return
            // },
            // userAcceptAppointment: async function(appointment_data) {
            //     //if confirming re schedule, appointment does not get created
            //     const created_appointments_result = await servicesManagerManager.createAppointment(
            //         appointment_data
            //     )

            //     const { created_appointments } = created_appointments_result.data

            //     const confirm_reschedule = appointment_data
            //         .map(a => {
            //             return {
            //                 created_appointment: a.related_Appointment,
            //                 message_id: a.message_ID,
            //             }
            //         })
            //         .filter(a => a.created_appointment)

            //     const to_confirm =
            //         created_appointments.length > 0 ? created_appointments : confirm_reschedule

            //     const is_follow_up = appointment_data[0].message_Action.status == 4

            //     if (to_confirm.length > 0) {
            //         const is_reschedule = confirm_reschedule.length > 0
            //         await servicesManagerManager.userConfirmSelected({
            //             to_confirm,
            //             is_reschedule,
            //             is_follow_up,
            //         })
            //     }
            //     servicesManagerManager.notifyProvidersAccept(appointment_data)
            // },
            // providerAcceptAppointment: async function(appointment_data) {
            //     await Promise.all([
            //         servicesManagerManager.confirmSelected(appointment_data),
            //         servicesManagerManager.notifyUsersConfirm(appointment_data),
            //     ])
            // },
            translateText: function(textObj) {
                return $http.post('/api/translateText', textObj)
            },
            getUserLocation: function() {
                return $http.get('/api/getLocation')
            },
            getUserProfile: function(token) {
                return $http.get('/api/getProfile/' + token)
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
                        'MÃ©x.': 'Mexico',
                        'Mich.': 'MichoacÃ¡n',
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
                        'Yuc.': 'YucatÃ¡n',
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
            getCustomer: function(token, redirect_url) {
                const globalManager = this
                const objUrl = globalManager.getUrlVars(redirect_url)
                if (token) {
                    let signed_services_count
                    globalManager.getUserProfile(token).then(async function(userData) {
                        if (userData.data.token) {
                            $cookies.putObject('MyMedQuestC00Ki3', {
                                userName: userData.data.username,
                                email: userData.data.email,
                                profileType: userData.data.profileType,
                                token,
                            })
                            const providerServicesCheck = await globalManager.checkProviderServices(
                                userData.data.ID
                            )

                            if (providerServicesCheck.data.status < 0) {
                                signed_services_count = 0
                            } else {
                                signed_services_count = +providerServicesCheck.data.count.count
                            }
                            if (
                                userData.data.profileType == 'Provider' &&
                                signed_services_count == 0
                            ) {
                                window.location.href =
                                    redirect_url || 'adminMedquest/#!/adminServices'
                            } else {
                                window.location.href =
                                    redirect_url || 'adminMedquest/#!/adminDashboard'
                            }
                        }
                    })
                } else if (Object.keys(objUrl).length > 0) {
                    const validateUrl = function(urlParam) {
                        var q = $q.defer()
                        globalManager
                            .getUserStaffApproval(JSON.stringify(urlParam))
                            .then(function(approvalResponse) {
                                if (approvalResponse.status == 404) {
                                    q.resolve(undefined)
                                } else {
                                    if (approvalResponse.status == 200) {
                                        q.resolve(approvalResponse)
                                    }
                                }
                            })
                            .catch(function(err) {
                                console.log('Error > ' + err)
                                q.reject(err.data)
                            })
                        return q.promise
                    }

                    const valdidation_url_promise = validateUrl(objUrl)
                    valdidation_url_promise
                        .then(function(response_) {
                            if (response_ !== undefined) {
                                globalManager.showToastMsg(
                                    'MyMedQ_MSG.LogIn.UserCorrectlyVSuccess1',
                                    'SUCCESS'
                                )
                                setTimeout(function() {
                                    window.location.href = '/login'
                                }, 2000)
                            } else {
                                globalManager.showToastMsg(
                                    'MyMedQ_MSG.LogIn.ErrorValidatingKeyE1',
                                    'ERROR'
                                )
                            }
                        })
                        .catch(function(e) {
                            globalManager.showToastMsg('MyMedQ_MSG.AccessDenied', 'ERROR')
                            console.log(e)
                        })
                }
            },
        }
    },
])
