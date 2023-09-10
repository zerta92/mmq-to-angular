'use strict'

angular.module('mainDropdownModule').component('mainDropdown', {
    moduleId: module.id,
    templateUrl: './app/components/main-dropdown/main_dropdown.template.html',
    bindings: { parseUrl: '&' },
    controller: [
        'GlobalServices',
        '$translate',
        '$cookies',
        '$rootScope',
        '$location',
        function mainDropdownController(
            GlobalServices,
            $translate,
            $cookies,
            $rootScope,
            $location
        ) {
            const ctrl = this
            ctrl.setLanguage = ''
            ctrl.is_logged_in = false
            ctrl.has_notifications = false
            ctrl.user = $rootScope.user

            if (ctrl.user && ctrl.user.loggedIn) {
                ctrl.is_logged_in = true
                getClientNotifications()
            }

            async function getClientNotifications() {
                const notifications = await GlobalServices.getClientNotifications({
                    profileType: ctrl.user.profileType,
                    ID: ctrl.user.ID,
                })
                const raw_notifications = notifications.data.unread_notifications

                ctrl.has_notifications = !!raw_notifications
            }

            ctrl.resultListProcedure = { procedures: [] }
            ctrl.getProceduresMatches = function(resultListProcedure) {
                GlobalServices.getProcedures('MMEDQ1_ALLC*#_.').then(function(autocompleteResult) {
                    if (autocompleteResult.data.length != 0) {
                        resultListProcedure.procedures = autocompleteResult.data.map(function(
                            queryResult
                        ) {
                            return {
                                label: queryResult.procedure_Name,
                                value: queryResult.procedure_ID,
                            }
                        })
                    }
                })
            }

            ctrl.w3_open = function() {
                var mySidebar = document.getElementById('mySidebar')
                if (mySidebar.style.display === 'block') {
                    mySidebar.style.display = 'none'
                } else {
                    mySidebar.style.display = 'block'
                }
            }

            ctrl.w3_close = function() {
                var mySidebar = document.getElementById('mySidebar')
                mySidebar.style.display = 'none'
            }

            ctrl.processInfoSearch = function(procedure_id) {
                $location.path(`/procedure-description/${procedure_id.value}`)
            }

            ctrl.logout = function() {
                ctrl.is_logged_in = false
                $cookies.remove('MyMedQuestC00Ki3', { path: '/' })
                $cookies.remove('MyMedQuestC00Ki3', { path: '/adminMedquest' })
            }

            ctrl.changeLanguage = function(lang) {
                $translate.use(lang)
                if (lang != undefined) {
                    if (lang.length != 0) {
                        GlobalServices.setCustomerPreferredLanguage(lang).then(function(lang) {
                            window.location.reload()
                        })
                    }
                }
                if (lang == 'en') {
                    ctrl.setLanguage = 'EN'
                }
                if (lang == 'sp') {
                    ctrl.setLanguage = 'SP'
                }
            }
        },
    ],
})
