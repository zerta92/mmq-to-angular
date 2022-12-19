'use strict'
import * as GlobalEnums from '../utils/global_enums'
import moment from 'moment'
angular
    .module('dashboardModule')
    .component('dashboardModule', {
        templateUrl: './app/dashboard/dashboard.component.html',
        controller: [
            '$scope',
            '$mdDialog',
            '$translate',
            'DashboardServices',
            // 'procedureManager',
            '$rootScope',
            'DTOptionsBuilder',
            '$location',
            '$anchorScroll',
            function DashboardController(
                $scope,
                $mdDialog,
                $translate,
                DashboardServices,
                // procedureManager,
                $rootScope,
                DTOptionsBuilder,
                $location,
                $anchorScroll
            ) {
                $scope.video = { show: false }

                $scope.user = $rootScope.user
                $scope.priviliges = $rootScope.priviliges
                $scope.dtInstance = []
                $scope.procedure = {}
                getUser()

                $scope.procedureSearchList = []
                $scope.procedureTop10 = []

                $scope.allUsers = []
                $scope.allProviders = []

                $scope.colorsGrapicPYB = [
                    '#FFEA00',
                    '#FF3D00',
                    '#F06292',
                    '#4DD0E1',
                    '#9CCC65',
                    '#FFD54F',
                    '#A1887F',
                    '#607D8B',
                    '#BA68C8',
                    '#009688',
                    '#E65100',
                    '#FF1744',
                    '#651FFF',
                    '#00B0FF',
                    '#00E676',
                ]
                $scope.colorsGrapicPYS = [
                    '#3F51B5',
                    '#FFC400',
                    '#6D4C41',
                    '#607D8B',
                    '#7B1FA2',
                    '#827717',
                    '#BF360C',
                    '#D500F9',
                    '#2979FF',
                    '#1DE9B6',
                    '#C6FF00',
                    '#FF9100',
                    '#BDBDBD',
                    '#18FFFF',
                    '#B2FF59',
                ]

                $scope.proceduresChartLabels = []
                $scope.proceduresGroupedByCategory = []
                $scope.proceduresChartData = []
                $scope.selectedAppointment = {}
                $scope.highlightedCard = {}

                $scope.dataProviderObjects = []
                $scope.acceptedServicesData = []
                $scope.acceptedServicesLabels = []
                $scope.servicesForAcceptingData = []
                $scope.servicesForAcceptingLabels = []
                $scope.pendingAppoinmentList = []

                $scope.dataUserObjects = []
                $scope.notificationOfConsultationData = []
                $scope.notificationOfConsultationLabels = []
                $scope.hiredServicesData = []
                $scope.hiredServicesLabels = []
                $scope.hiredServicesObjs = []

                $scope.servicesChartLabel = []
                $scope.servicesChartData = []
                $scope.series = ['Number of services', 'Average price in thousands']
                $scope.servicesChartDataSerieA = []
                $scope.servicesChartDataSerieB = []

                $scope.userInfoClick = {}

                $scope.providerInfoClick = {}

                $scope.userInfoClick4Accepting = {}
                $scope.showUsrInfoGrid = false
                $scope.showUsrInfoGrid4Accepting = false

                $scope.languageSelected = ''

                $scope.isOpen = false
                $scope.selectedMode = 'md-scale'

                $scope.isOpenAction = false
                $scope.selectedModeAction = 'md-scale'

                $scope.imagePath = '.app/template/img/userImgageCard.png'

                $scope.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(20)

                if ($location.hash()) {
                    setTimeout(() => {
                        $location.hash($location.hash())
                        $anchorScroll()
                    }, 1000)
                }

                setInterval(() => {
                    getAppointments($scope.user.profileType)
                }, 60000)

                $scope.changeLanguage = function(lang) {
                    console.log('DashBoard Lenguaje a :: ' + lang)
                    $scope.languageSelected = lang
                    $translate.use(lang)
                    getUser()
                }

                $scope.load_demo_appointments = window.location.href.includes('load_demo')

                $scope.loadProceduresDataModal = function(elements, evt) {
                    const clicked_category_label = elements[0]._model.label

                    var htmlContent = ''
                    $scope.procedureSearchList = []
                    $scope.proceduresGroupedByCategory[clicked_category_label].forEach(function(
                        procedure
                    ) {
                        const category_id = procedure.category_ID
                        const category_Name = procedure.category_Name

                        htmlContent =
                            htmlContent +
                            `<a href="#!/procedures?procedureId=${procedure.procedure_ID}" 
                    class="list-group-item list-group-item-action list-group-item-info" data-toggle="tooltip" data-placement="bottom" title="Click to edit  
                    " >  
                    ${procedure.procedure_Name} 
                    " <span class="glyphicon glyphicon-chevron-right"></span> </a>"`

                        htmlContent = ` 
                    <html lang="en"> 
                     <head> 
                     <meta charset="utf-8"> 
                     <meta name="viewport" content="width=device-width, initial-scale=1"> 
                     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">  
                     <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> 
                     <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> 
                     </head>  
                     <body><div class="list-group">  
                    ${htmlContent} 
                     </div> </body> </html> `
                    })

                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title(`Procedures in the ${clicked_category_label} category `)
                            .htmlContent(htmlContent)
                            .ok('CLOSE')
                            .openFrom('#left')
                            .closeTo(angular.element(document.querySelector('#right')))
                    )
                }

                async function loadProcedureData() {
                    const {
                        data: procedures_by_category,
                    } = await procedureManager.getProceduresByCategory()
                    $scope.proceduresChartLabels = Object.keys(procedures_by_category)
                    $scope.proceduresChartData = Object.values(procedures_by_category).map(
                        x => x.length
                    )
                    $scope.proceduresGroupedByCategory = procedures_by_category
                }

                /**
                 * @author jorgemedinabernal
                 */
                async function loadAllUserProcedures() {
                    const {
                        data: services_by_category,
                    } = await DashboardServices.getAllServicesByCategory()

                    $scope.servicesChartDataSerieA = Object.values(services_by_category).map(
                        x => x.length
                    )
                    $scope.servicesChartLabel = Object.keys(services_by_category)
                    $scope.servicesChartDataSerieB = Object.values(services_by_category).map(
                        x => sumBy(x, 'price') / x.length / 1000
                    )

                    $scope.servicesChartData.push(
                        $scope.servicesChartDataSerieA,
                        $scope.servicesChartDataSerieB
                    )
                }

                function loadProceduresTop10() {
                    DashboardServices.getProceduresTop10()
                        .then(function(procedureData) {
                            $scope.procedureTop10 = procedureData.data
                        })
                        .catch(function(err) {
                            showToastMsg(
                                'Unexpected Error, Please contact the administrator',
                                'ERROR'
                            )
                            console.log('Unexpected Error : ' + '  ' + err)
                        })
                }

                function loadAllUsers() {
                    DashboardServices.loadAllUsers()
                        .then(function(userData) {
                            $scope.allUsers = userData.data
                        })
                        .catch(function(err) {
                            showToastMsg(
                                'Unexpected Error, Please contact the administrator',
                                'ERROR'
                            )
                            console.log('Unexpected Error : ' + '  ' + err)
                        })
                }

                function loadAllProviders() {
                    DashboardServices.loadAllProviders()
                        .then(function(providerData) {
                            $scope.allProviders = providerData.data
                        })
                        .catch(function(err) {
                            showToastMsg(
                                'Unexpected Error, Please contact the administrator',
                                'ERROR'
                            )
                            console.log('Unexpected Error : ' + '  ' + err)
                        })
                }

                $scope.loadUserInfoData = function(elements, evt) {
                    var userId = elements[0]._model.label.substring(
                        1,
                        elements[0]._model.label.indexOf(')')
                    )
                    $scope.showUsrInfoGrid = true

                    DashboardServices.getUserDataById(userId)
                        .then(function(userDataInfo) {
                            $scope.userInfoClick = userDataInfo.data[0]
                        })
                        .catch(function(err) {
                            showToastMsg(
                                'Unexpected Error, Please contact the administrator',
                                'ERROR'
                            )
                            console.log('Unexpected Error : ' + '  ' + err)
                        })
                }

                $scope.loadUserInfoData4Accepting = function(elements, evt) {
                    $mdDialog
                        .show({
                            locals: {
                                objVar_:
                                    $scope.hiredServicesObjs[
                                        elements[0]._view.label.substring(
                                            0,
                                            elements[0]._view.label.indexOf(')')
                                        ) - 1
                                    ],
                            },
                            controller: DialogControllerInfoD,
                            templateUrl: '/dialogTemplate/showInfoServices.html',
                            parent: angular.element(document.body),
                            targetEvent: evt,
                            clickOutsideToClose: true,
                        })
                        .then(
                            function(answer) {
                                $scope.status = 'You said the information was "' + answer + '".'
                            },
                            function() {
                                $scope.status = 'You cancelled the dialog.'
                            }
                        )
                }

                function DialogControllerInfoD($scope, $mdDialog, objVar_) {
                    $scope.obj = objVar_
                    $scope.back_ = function() {
                        $mdDialog.hide()
                    }
                }

                $scope.loadProviderInfoData = function(elements, evt) {
                    if (elements != undefined) {
                        console.log('. ' + elements[0]._model.label)
                        console.log('.. ' + JSON.stringify(elements[0]._model.label))
                        var providerId = elements[0]._model.label.substring(
                            1,
                            elements[0]._model.label.indexOf(')')
                        )
                        $scope.showUsrInfoGrid = true

                        DashboardServices.getProviderDataById(providerId)
                            .then(function(providerDataInfo) {
                                $scope.providerInfoClick = providerDataInfo.data[0]
                            })
                            .catch(function(err) {
                                showToastMsg(
                                    'Unexpected Error, Please contact the administrator',
                                    'ERROR'
                                )
                                console.log('Unexpected Error : ' + '  ' + err)
                            })
                    }
                }

                $scope.goToPersonalInfo = function() {
                    location.href = '#!/profile'
                }

                function getUser() {
                    $scope.user = $rootScope.user
                    $scope.priviliges = $rootScope.priviliges
                    getAppointments($scope.user.profileType)
                    if ($scope.user.profileType == GlobalEnums.AccountType.Provider) {
                        DashboardServices.getDataProviderInforDashBoard($scope.user.ID)
                            .then(function(dataReport) {
                                $scope.dataProviderObjects = dataReport.data
                                if (dataReport.data != '') {
                                    dataReport.data.forEach(function(data_) {
                                        if (data_.CountToAccept !== 0) {
                                            $scope.servicesForAcceptingData.push(
                                                data_.CountToAccept
                                            )
                                            $scope.servicesForAcceptingLabels.push(
                                                '(' +
                                                    data_.userId +
                                                    ')' +
                                                    data_.ServiceProcedureName
                                            )
                                        }

                                        if (data_.CountAccepted !== 0) {
                                            $scope.acceptedServicesData.push(data_.CountAccepted)
                                            $scope.acceptedServicesLabels.push(
                                                '(' +
                                                    data_.userId +
                                                    ')' +
                                                    data_.ServiceProcedureName
                                            )
                                        }
                                    })
                                }
                            })
                            .catch(function(err) {
                                showToastMsg(
                                    'Unexpected Error, Please contact the administrator',
                                    'ERROR'
                                )
                                console.log('Unexpected Error : ' + '  ' + err)
                                return
                            })
                    } else if ($scope.user.profileType == GlobalEnums.AccountType.User) {
                        DashboardServices.getDataUserInforDashBoard($scope.user.ID)
                            .then(function(dataReport1) {
                                dataReport1.data.forEach(function(dataReport) {
                                    $scope.notificationOfConsultationLabels.push(
                                        dataReport.ServiceProcedureName
                                    )
                                    $scope.notificationOfConsultationData.push(1)
                                })
                            })
                            .catch(function(err) {
                                showToastMsg(
                                    'Unexpected Error, Please contact the administrator',
                                    'ERROR'
                                )
                                console.log('Unexpected Error : ' + '  ' + err)
                            })

                        DashboardServices.getDataUserInforHiredServicesDashBoard($scope.user.ID)
                            .then(function(dataReport2) {
                                if (dataReport2.data.length != 0) {
                                    var count2 = 1
                                    dataReport2.data.forEach(function(dataReport) {
                                        $scope.hiredServicesLabels.push(
                                            count2 + ') ' + dataReport.ServiceProcedureName
                                        )
                                        $scope.hiredServicesData.push(count2)
                                        $scope.hiredServicesObjs.push(dataReport)
                                        count2 += 1
                                    })
                                }
                            })
                            .catch(function(err) {
                                showToastMsg(
                                    'Unexpected Error, Please contact the administrator',
                                    'ERROR'
                                )
                                console.log('Unexpected Error : ' + '  ' + err)
                            })
                    } else if ($scope.user.profileType == GlobalEnums.AccountType.Admin) {
                        loadProcedureData()
                        loadAllUserProcedures()
                        loadProceduresTop10()
                        loadAllUsers()
                        loadAllProviders()
                    }
                }

                async function getAppointments(profileType) {
                    if (profileType == GlobalEnums.AccountType.Provider) {
                        const dataReport = await DashboardServices.getPendingAppoinments(
                            $scope.user.ID,
                            $scope.load_demo_appointments
                        )

                        if (!dataReport.data) {
                            return
                        }

                        sortPastAndPendingAppointments(dataReport.data)
                        for (const elem of $scope.pendingAppoinmentList) {
                            $scope.hiredServicesObjs.push(elem)
                            const feedback = await getFeedback(elem.appointment_ID)
                            if (feedback[0] != undefined) {
                                elem.followUp_Status_User = feedback[0].followUp_Status_User
                                elem.followUp_Status_Provider = feedback[0].followUp_Status_Provider
                            }
                        }

                        for (const elem of $scope.pastAppoinmentList) {
                            $scope.hiredServicesObjs.push(elem)
                            const feedback = await getFeedback(elem.appointment_ID)
                            if (feedback[0] != undefined) {
                                elem.followUp_Status_User = feedback[0].followUp_Status_User
                                elem.followUp_Status_Provider = feedback[0].followUp_Status_Provider
                            }
                        }
                    } else if (profileType == GlobalEnums.AccountType.User) {
                        const dataReport = await DashboardServices.getUserAppoinments(
                            $scope.user.ID
                        )

                        if (!dataReport.data) {
                            return
                        }
                        sortPastAndPendingAppointments(dataReport.data)
                        for (const elem of $scope.pendingAppoinmentList) {
                            const feedback = await getFeedback(elem.appointment_ID)
                            if (feedback[0] != undefined) {
                                elem.followUp_Status_User = feedback[0].followUp_Status_User
                                elem.followUp_Status_Provider = feedback[0].followUp_Status_Provider
                            }
                        }

                        for (const elem of $scope.pastAppoinmentList) {
                            const feedback = await getFeedback(elem.appointment_ID)
                            if (feedback[0] != undefined) {
                                elem.followUp_Status_User = feedback[0].followUp_Status_User
                                elem.followUp_Status_Provider = feedback[0].followUp_Status_Provider
                            }
                        }
                    }
                }

                function sortPastAndPendingAppointments(appointments) {
                    $scope.pendingAppoinmentList = appointments.filter(appointment => {
                        const appointment_date_plus_an_hour = moment(
                            appointment.appointment_Date
                        ).add(60, 'minutes')
                        return moment().isBefore(appointment_date_plus_an_hour)
                    })

                    $scope.pastAppoinmentList = appointments.filter(appointment => {
                        const appointment_date_plus_an_hour = moment(
                            appointment.appointment_Date
                        ).add(60, 'minutes')
                        return moment().isAfter(appointment_date_plus_an_hour)
                    })
                }

                function getFeedback(appointmentID) {
                    //check if either party provided feedback
                    return new Promise(function(resolve, reject) {
                        DashboardServices.getConsultationFeedback(appointmentID)
                            .then(function(feedback) {
                                if (feedback.data.status < 0) {
                                    reject(feedback.data.message)
                                } else {
                                    resolve(feedback.data)
                                }
                            })
                            .catch(function(err) {
                                showToastMsg(
                                    'Unexpected Error, Please contact the administrator',
                                    'ERROR'
                                )
                                console.log('Unexpected Error : ' + '  ' + err)
                                reject('Unexpected Error : ' + '  ' + err.status + '  ' + err.data)
                            })
                    })
                }
                /**
                 * @author jorgemedinabernal
                 */
                $scope.showServicesOptions = function(ev, appointmentOb) {
                    DashboardServices.getOptionsInfoByServicesId(appointmentOb)
                        .then(function(optionInformation) {
                            $mdDialog.show(
                                $mdDialog
                                    .alert()
                                    .parent(
                                        angular.element(document.querySelector('#popupContainer'))
                                    )
                                    .clickOutsideToClose(true)
                                    .title(optionInformation.data[0].option_Name)
                                    .textContent(optionInformation.data[0].option_DescriptionFull)
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('CLOSE')
                                    .targetEvent(ev)
                            )
                        })
                        .catch(function(err) {
                            showToastMsg(
                                'Unexpected Error, Please contact the administrator',
                                'ERROR'
                            )
                            console.log('Unexpected Error : ' + '  ' + err)
                        })
                }
            },
        ],
    })
    .directive('confirmAppointment', function() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=confirmAppointment',
            },
            link: function(scope, element, attributes, ngModel) {
                ngModel.$validators.confirmAppointment = function(modelValue) {
                    return (
                        modelValue == 'undefined' ||
                        modelValue == false ||
                        modelValue == undefined ||
                        (scope.otherModelValue == true && modelValue == true)
                    )
                }

                scope.$watch('otherModelValue', function() {
                    ngModel.$validate()
                })
            },
        }
    })

    .directive('formatDate3', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, modelCtrl) {
                modelCtrl.$formatters.push(function(modelValue) {
                    return new Date(modelValue)
                })
            },
        }
    })

    .directive('creditCardType', function() {
        var directive = {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    scope.ccinfo.type = /^5[1-5]/.test(value)
                        ? 'mastercard'
                        : /^4/.test(value)
                        ? 'visa'
                        : /^3[47]/.test(value)
                        ? 'amex'
                        : /^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(
                              value
                          )
                        ? 'discover'
                        : undefined
                    ctrl.$setValidity('invalid', !!scope.ccinfo.type)
                    return value
                })
            },
        }
        return directive
    })

    .directive('cardExpiration', function() {
        var directive = {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                scope.$watch(
                    '[ccinfo.month,ccinfo.year]',
                    function(value) {
                        ctrl.$setValidity('invalid', true)
                        if (
                            scope.ccinfo.year == scope.currentYear &&
                            scope.ccinfo.month <= scope.currentMonth
                        ) {
                            ctrl.$setValidity('invalid', false)
                        }
                        return value
                    },
                    true
                )
            },
        }
        return directive
    })

    .filter('range', function() {
        var filter = function(arr, lower, upper) {
            for (var i = lower; i <= upper; i++) arr.push(i)
            return arr
        }
        return filter
    })
