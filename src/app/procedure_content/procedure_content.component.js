'use strict'

angular
    .module('procedureContentModule')
    .filter('shortName', function() {
        return function(input) {
            return input.substring(0, 20)
        }
    })
    .component('procedureContentModule', {
        templateUrl: './app/procedure_content/procedure_content.component.html',
        controller: [
            '$scope',
            'ProcedureContentServices',
            'GlobalServices',
            '$translate',
            '$route',
            'ngMeta',
            function ProcedureContentController(
                $scope,
                ProcedureContentServices,
                GlobalServices,
                $translate,
                $route,
                ngMeta
            ) {
                $scope.procedure = {}
                $scope.submit = {}
                $scope.message = {}

                $scope.curentyear = new Date().getFullYear()
                $scope.curentDate = new Date()

                $scope.noProcedure = false
                ;(async function parseURL() {
                    if ($route.current.params && $route.current.params.id) {
                        const procedure_ID = $route.current.params.id
                        if (procedure_ID != '') {
                            await getCustomerPreferredLanguage()
                            ProcedureContentServices.getProcedureWithCategory(procedure_ID).then(
                                function(procedureCategory) {
                                    if (
                                        procedureCategory.data.status == -1 ||
                                        procedureCategory.data.length == 0
                                    ) {
                                        $scope.procedure.procedure_Name = 'Procedure Not Found'
                                    } else {
                                        $scope.procedure = procedureCategory.data[0]
                                        setPageAttributes()
                                        ProcedureContentServices.findRelatedProceduresByCategoryID(
                                            $scope.procedure.category_ID
                                        ).then(function(related) {
                                            $scope.related = related.data
                                        })
                                    }
                                }
                            )
                        } else {
                            $scope.procedure.procedure_Name = 'Procedure Not Found'
                        }
                    } else {
                        $scope.noProcedure = true
                    }
                })()

                $scope.resultListProcedure = { procedures: [] }
                $scope.getProceduresMatches = function(resultListProcedure) {
                    GlobalServices.getProcedures('MMEDQ1_ALLC*#_.').then(function(proceduresList) {
                        if (proceduresList.data.length != 0) {
                            $scope.resultListProcedure.procedures = proceduresList.data.map(
                                function(queryResult) {
                                    return {
                                        label: queryResult.procedure_Name,
                                        value: queryResult.procedure_ID,
                                    }
                                }
                            )
                        }
                    })
                }

                $scope.getProceduresMatches()

                $scope.selectedProcedure = function(procedure) {
                    $location.path(`/procedure-description/${procedure}`)
                }

                function setPageAttributes() {
                    const page_title = `${$scope.procedure.procedure_Name} | Find Dentists Online`
                    ngMeta.setTitle(page_title)
                }

                async function getCustomerPreferredLanguage() {
                    const preferred_language = await GlobalServices.getCustomerPreferredLanguage()
                    const language = $route.current.params.language || preferred_language.data
                    if (language) {
                        await GlobalServices.setCustomerPreferredLanguage(language)
                        $translate.use(language)
                    }
                }
            },
        ],
    })
