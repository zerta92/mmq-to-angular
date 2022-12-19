'use strict'
import * as GlobalEnums from '../utils/global_enums'
angular.module('profileModule').component('profileModule', {
    templateUrl: './app/profile/profile.component.html',
    controller: [
        '$scope',
        'LoginServices',
        'GlobalServices',
        '$rootScope',
        function ProfileController($scope, LoginServices, GlobalServices, $rootScope) {
            $scope.user = $rootScope.user
            $scope.priviliges = $rootScope.priviliges
            getUser()

            $scope.URL = ''
            $scope.statesT
            $scope.traslateType = 'en'
            $scope.disable_changes = false
            $scope.states = Object.values(GlobalServices.getSupportedCountryCodesAndStates().us)

            $scope.MxStates = Object.values(GlobalServices.getSupportedCountryCodesAndStates().mx)
            $scope.SpStates = Object.values(GlobalServices.getSupportedCountryCodesAndStates().es)
            $scope.CaStates = Object.values(GlobalServices.getSupportedCountryCodesAndStates().ca)
            $scope.countryList = GlobalServices.getSupportedCountriesNames()

            /**
             * @author Jorge Medina
             */
            $rootScope.$on('$translateChangeEnd', function(event, args) {
                $scope.traslateType = args.language
                LoginServices.setCustomerPreferredLanguage($scope.traslateType).then(function(
                    lang
                ) {})
                getUser()
            })

            /**
             * @author Jorge Medina
             */
            $scope.loadStates = function() {
                loadStaff()
            }

            function loadStaff() {
                if ($scope.user.country == 'United States') {
                    $scope.statesT = $scope.states
                } else if ($scope.user.country == 'Mexico') {
                    $scope.statesT = $scope.MxStates
                } else if ($scope.user.country == 'Spain') {
                    $scope.statesT = $scope.SpStates
                } else if ($scope.user.country == 'Canada') {
                    $scope.statesT = $scope.CaStates
                }
            }

            function getUser() {
                if ($scope.user) {
                    try {
                        $scope.user.profile_type_in_approprtiate_language =
                            $scope.traslateType == 'sp'
                                ? $scope.user.profileType == GlobalEnums.AccountType.Provider
                                    ? 'Proveedor'
                                    : $scope.user.profileType == GlobalEnums.AccountType.User
                                    ? 'Usuario'
                                    : $scope.user.profileType == 'Staff'
                                    ? 'Personal'
                                    : 'Administrador'
                                : $scope.user.profileType == GlobalEnums.AccountType.Provider
                                ? GlobalEnums.AccountType.Provider
                                : $scope.user.profileType == GlobalEnums.AccountType.User
                                ? GlobalEnums.AccountType.User
                                : $scope.user.profileType == 'Staff'
                                ? 'Staff'
                                : 'Administrator'

                        loadStaff()

                        $scope.disable_changes =
                            $scope.user.profileType != 'Staff' &&
                            $scope.user.profileType != GlobalEnums.AccountType.Provider &&
                            $scope.user.profileType != GlobalEnums.AccountType.User
                    } catch (err) {
                        GlobalServices.showToastMsg(
                            'Error Getting profile information, please try again later.',
                            'ERROR'
                        )
                    }
                }
            }

            $scope.saveInfo = function() {
                if (
                    $scope.user.profileType == 'Staff' ||
                    $scope.user.profileType == GlobalEnums.AccountType.Provider ||
                    $scope.user.profileType == GlobalEnums.AccountType.Admin
                ) {
                    LoginServices.updateType1Information($scope.user).then(function(userData) {
                        if (userData.data.status >= 0) {
                            GlobalServices.showToastMsg('Information correctly saved.', 'SUCCESS')
                        } else {
                            GlobalServices.showToastMsg(
                                'Error Saving profile information, please try again later.',
                                'ERROR'
                            )
                        }
                    })
                } else if ($scope.user.profileType == GlobalEnums.AccountType.User) {
                    LoginServices.updateType2Information($scope.user).then(function(userData) {
                        if (userData.data.status >= 0) {
                            GlobalServices.showToastMsg('Information correctly saved.', 'SUCCESS')
                        } else {
                            GlobalServices.showToastMsg(
                                'Error Saving profile information, please try again later.',
                                'ERROR'
                            )
                        }
                    })
                }
            }
        },
    ],
})
