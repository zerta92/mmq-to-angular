'use strict'
import * as GlobalEnums from '../../utils/global_enums'
angular.module('dashboardMenuModule', []).component('dashboardMenu', {
    templateUrl: './app/components/dashboard_menu/dashboard_menu.component.html',
    controller: [
        '$rootScope',
        '$scope',
        'GlobalServices',
        async function ContactProviderModuleController($rootScope, $scope, GlobalServices) {
            $scope.userMenu = []
            $scope.user = $rootScope.user

            getMenu($scope.user.profileId)
            loadHowToVideos('index')

            function getMenu(profile_id) {
                GlobalServices.getUserMenu(profile_id).then(function(menuData) {
                    $scope.userMenu = menuData.data
                })
            }

            function loadHowToVideos(param) {
                GlobalServices.getBannerInfoByMenu(param).then(function(autInfo) {
                    $scope.infoBannerMenu =
                        $scope.user.profileType == GlobalEnums.AccountType.Provider
                            ? autInfo.data.provider
                            : autInfo.data.user
                })
            }
        },
    ],
})
