//@ts-nocheck
'use strict'
import _ from 'lodash'
const serviceSelector = {
    selector: 'serviceSelector',
    controller: class ServiceSelectorController {
        private user
        private appointment
        private total
        private brands
        private shoppingCart
        private $mdDialog
        private ShoppingCartServices
        private GlobalServices
        private BrandServices
        private $mdBottomSheet
        private $mdSidenav
        private $rootScope

        constructor(
            GlobalServices,
            ShoppingCartServices,
            BrandServices,
            $mdBottomSheet,
            $mdDialog,
            $rootScope,
            $mdSidenav
        ) {
            this.$mdDialog = $mdDialog
            this.user = $rootScope.user
            this.ShoppingCartServices = ShoppingCartServices
            this.GlobalServices = GlobalServices
            this.BrandServices = BrandServices
            this.$mdBottomSheet = $mdBottomSheet
            this.$mdSidenav = $mdSidenav
        }

        $onChanges = function(appointment) {
            if (angular.isDefined(appointment)) {
                this.showModal()
            }
        }

        showModal() {
            const ctrl = this
            this.$mdDialog
                .show({
                    locals: {
                        appointmentObj: this.appointment,
                        user: this.user,
                        total: this.total,
                        brands: this.brands,
                        shoppingCart: this.shoppingCart,
                        ShoppingCartServices: this.ShoppingCartServices,
                        GlobalServices: this.GlobalServices,
                        BrandServices: this.BrandServices,
                        $mdSidenav: this.$mdSidenav,
                        $mdBottomSheet: this.$mdBottomSheet,
                    },
                    controller: [
                        '$scope',
                        '$mdDialog',
                        'appointmentObj',
                        'user',
                        'total',
                        'brands',
                        'shoppingCart',
                        'ShoppingCartServices',
                        'GlobalServices',
                        'BrandServices',
                        '$mdSidenav',
                        '$mdBottomSheet',
                        function DialogControllerAddServiceToCart(
                            $scope,
                            $mdDialog,
                            appointmentObj,
                            user,
                            total,
                            brands,
                            shoppingCart,
                            ShoppingCartServices,
                            GlobalServices,
                            BrandServices,
                            $mdSidenav,
                            $mdBottomSheet
                        ) {
                            return ctrl.DialogControllerAddServiceToCart(
                                $scope,
                                $mdDialog,
                                appointmentObj,
                                user,
                                total,
                                brands,
                                shoppingCart,
                                ShoppingCartServices,
                                GlobalServices,
                                BrandServices,
                                $mdSidenav,
                                $mdBottomSheet
                            )
                        },
                    ],
                    templateUrl:
                        './app/components/service_selector/service_selector.component.html',
                    parent: angular.element(document.body),
                    multiple: true,
                    clickOutsideToClose: true,
                })
                .catch(err => console.log(err))
        }

        DialogControllerAddServiceToCart(
            $scope,
            $mdDialog,
            appointmentObj,
            user,
            total,
            brands,
            shoppingCart,
            ShoppingCartServices,
            GlobalServices,
            BrandServices,
            $mdSidenav,
            $mdBottomSheet
        ) {
            $scope.appointment = appointmentObj
            $scope.user = user
            $scope.brands = brands
            $scope.total = total
            $scope.shoppingCart = shoppingCart
            $scope.procedureSearchList = []
            $scope.categoriesSelectedList = []
            $scope.categorie = {}
            $scope.categorieList = []

            loadCategoriesByUser()

            function loadCategoriesByUser() {
                ShoppingCartServices.getUserCategories($scope.appointment.provider_ID)
                    .then(function(allUserCategoriesData) {
                        $scope.categorieList = allUserCategoriesData.data
                    })
                    .catch(function(err) {
                        GlobalServices.showToastMsg(
                            'Unexpected Error, Please contact the administrator',
                            'ERROR'
                        )
                        console.log('Unexpected Error : ' + '  ' + err)
                    })
            }

            $scope.selectCategorieClick = function(categoryObj) {
                const categoryUserId =
                    categoryObj.category_ID + '&' + $scope.appointment.provider_ID
                $scope.categorie = categoryObj
                loadServicesbyCategory(categoryObj)
                ShoppingCartServices.getUserSubCategories(categoryUserId)
                    .then(function(subCategoryList) {
                        $scope.categorieListAux = subCategoryList.data

                        if ($scope.categorieListAux.length != 0) {
                            $scope.categorieList = $scope.categorieListAux
                            $scope.pathImgCategory =
                                '/template/img/ic_insert_drive_file_black_24px.svg'
                            $scope.selectedIndexC = null
                        }
                        $scope.loading = false
                    })
                    .catch(function(err) {
                        if (err.status == 401) {
                            GlobalServices.showToastMsg('MyMedQ_MSG.TokenEx', 'ERROR')
                            window.location.href = '/logout'
                        } else if (err.status == 400) {
                            GlobalServices.showToastMsg('MyMedQ_MSG.AccessDenied', 'ERROR')
                        }
                        GlobalServices.showToastMsg(
                            'MyMedQ_MSG.PleaseContactTheAdministrator',
                            'ERROR'
                        )
                        console.log('Error de tipo :::> ' + err)
                    })
            }

            function loadServicesbyCategory(categoryObj) {
                $scope.dummyIdsVar = categoryObj.category_ID + '&' + $scope.appointment.provider_ID
                ShoppingCartServices.getServicesByCategory(JSON.stringify($scope.dummyIdsVar))
                    .then(function(procedureData) {
                        $scope.procedureSearchList = procedureData.data
                    })
                    .catch(function(err) {
                        GlobalServices.showToastMsg(
                            'Unexpected Error, Please contact the administrator',
                            'ERROR'
                        )
                        console.log('Unexpected Error : ' + '  ' + err)
                    })
            }

            $scope.backToAllCategories = function() {
                $scope.categorie = {}
                $scope.procedureSearchList = []
                loadCategoriesByUser()
            }

            $scope.add_service_flag = false
            $scope.addNewService = async function(newProcedure) {
                const serv_1_id = Object.keys($scope.shoppingCart)[0]
                const cart_ID = $scope.shoppingCart[serv_1_id][0].cart_ID
                $scope.addService = {
                    cart_Cost: newProcedure.servicePrice, //cart cost for service (service plus items)
                    cart_ID,
                    user_ID: $scope.appointment.user_ID,
                    cart_PriceFactor: newProcedure.servicePriceFactor,
                    service_ID: newProcedure.service_ID,
                    procedure_Name: newProcedure.procedure_Name,
                    service_Price: newProcedure.servicePrice,
                    cart_realPrice: newProcedure.servicePrice,
                    total_Price: newProcedure.servicePrice,
                    cart_Quantity: 1,
                }
                const {
                    data: [new_service_brands],
                } = await BrandServices.getSelectedProcedureBrands({
                    service_ID: newProcedure.service_ID,
                })

                if (new_service_brands) {
                    $scope.brands.push(new_service_brands)
                }
                //@ts-ignore
                $scope.brands = _.uniqBy($scope.brands, v => [v.brand_ID, v.service_ID].join())

                if ($scope.shoppingCart[newProcedure.service_ID] == undefined) {
                    $scope.shoppingCart[newProcedure.service_ID] = {}
                    $scope.shoppingCart[newProcedure.service_ID]['0'] = ['null']
                    $scope.shoppingCart[newProcedure.service_ID] = []
                    $scope.shoppingCart[newProcedure.service_ID].push($scope.addService)
                    setGlobalPrice(newProcedure.service_ID, null, null)
                }
            }

            function setGlobalPrice(service_ID, old_quantity, quantity) {
                if (old_quantity && quantity) {
                    $scope.total.amount -= $scope.shoppingCart[service_ID][0].cart_Cost
                    $scope.shoppingCart[service_ID][0].cart_Cost =
                        ($scope.shoppingCart[service_ID][0].cart_Cost / old_quantity) * quantity
                }
                $scope.total.amount += $scope.shoppingCart[service_ID][0].cart_Cost
                $scope.total[service_ID] = $scope.total.amount
                $scope.total.number_of_services++
            }

            $scope.showFullDescription = function(procedure) {
                $mdBottomSheet
                    .show({
                        template: full_description_template,
                        locals: {
                            procedure,
                            $mdBottomSheet: $mdBottomSheet,
                        },
                        controller: fullDescriptionController,
                        multiple: true,
                        clickOutsideToClose: true,
                        parent: angular.element(document.body),
                        controllerAs: '$ctrl',
                    })
                    .then(function(procedure) {
                        if (procedure) {
                            $scope.addNewService(procedure)
                        }
                    })
            }

            const full_description_template = `
            <md-bottom-sheet class="md-list md-has-header" >
                <md-subheader ng-cloak><h2>{{procedure.procedure_Name}}</h2></md-subheader>
                <div layout="row">
                    <div flex="">{{full_description}}</div>
                </div>
                <div layout="row" layout-align="center center">
                      <div>
                        <div layout="row">
                            <div flex="">
                                <md-button class="md-primary md-raised md-warn md-cornered" ng-click="addButtonClicked(procedure)">
                                    Add To Cart
                                    <md-icon md-svg-icon="/template/img/ic_done_all_black_24px.svg"></md-icon>
                                    <md-tooltip md-direction="Bottom">Add Service To Cart </md-tooltip>
                                </md-button>
                            </div>
                            <div flex=""></div>
                            <div flex="">
                                <md-button class="md-accent md-raised md-hue-1" ng-click="closeWindow()">
                                    Close
                                    <md-icon md-svg-icon="/template/img/ic_done_all_black_24px.svg"></md-icon>
                                    <md-tooltip md-direction="Bottom">Close this window </md-tooltip>
                                </md-button>
                            </div>
                        </div>
                    </div>
                </div>

        </md-bottom-sheet>
        `

            const fullDescriptionController = function(
                $scope,
                $mdDialog,
                $mdBottomSheet,
                procedure
            ) {
                $scope.procedure = procedure
                $scope.full_description = procedure.procedure_DescriptionFull

                $scope.addButtonClicked = function(procedure) {
                    $mdBottomSheet.hide(procedure)
                }

                $scope.closeWindow = function() {
                    $mdBottomSheet.hide()
                }
            }

            $scope.querySearch = function(query) {
                var results = query
                    ? $scope.procedureSearchList.filter(createFilterFor(query))
                    : $scope.procedureSearchList
                return results
            }

            function createFilterFor(query) {
                var lowercaseQuery = query.toLowerCase()

                return function filterFn(service) {
                    const lower_case_service_name = service.procedure_Name.toLowerCase()
                    return lower_case_service_name.includes(lowercaseQuery)
                }
            }

            $scope.toggleLeft = buildTogglerLeft('left')

            function buildTogglerLeft(navID) {
                return function() {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function() {})
                        .catch(function(err) {
                            GlobalServices.showToastMsg(
                                'MyMedQ_MSG.PleaseContactTheAdministrator',
                                'ERROR'
                            )
                            console.log('Unexpected Error : ' + err)
                        })
                }
            }

            $scope.close = function() {
                $mdDialog.hide()
            }

            $scope.closeSideNav = function() {
                $mdSidenav('left')
                    .close()
                    .then(function() {})
                    .catch(function(err) {
                        this.showToastMsg('MyMedQ_MSG.PleaseContactTheAdministrator', 'ERROR')
                        console.log('Unexpected Error : ' + err)
                    })
            }
        }
    },
    scope: {},
    bindings: {
        appointment: '<',
        shoppingCart: '=',
        brands: '=',
        total: '=',
    },
}

angular.module('serviceSelectorModule', []).component('serviceSelector', serviceSelector)
