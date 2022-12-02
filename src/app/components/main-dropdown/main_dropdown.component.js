'use strict';

angular.module('mainDropdownModule').component('mainDropdown', {
    moduleId: module.id,
    templateUrl: './app/components/main-dropdown/main_dropdown.template.html',
    bindings: { parseUrl: '&' },
    controller: function mainDropdownController(
      GlobalServices,
      $translate,
      $cookies
    ) {
      const ctrl = this;
      ctrl.setLanguage = '';
      ctrl.is_logged_in = false;
      if (
        $cookies.getObject('MyMedQuestC00Ki3') &&
        !$cookies.getObject('MyMedQuestC00Ki3').seen_signup_dialog
      ) {
        ctrl.is_logged_in = true;
      }
  
      ctrl.resultListProcedure = { procedures: [] };
      ctrl.getProceduresMatches = function(resultListProcedure) {
        GlobalServices
          .getProcedures('MMEDQ1_ALLC*#_.')
          .then(function(autocompleteResult) {
            if (autocompleteResult.data.length != 0) {
              resultListProcedure.procedures = autocompleteResult.data.map(
                function(queryResult) {
                  return {
                    label: queryResult.procedure_Name,
                    value: queryResult.procedure_ID
                  };
                }
              );
            }
          });
      };
  
      ctrl.processInfoSearch = function(procedure_id) {
        location.href =
          '/procedure-description?procedure-id=' + procedure_id.value;
      };
  
      ctrl.logout = function() {
        $cookies.remove('MyMedQuestC00Ki3', { path: '/' });
      };
  
      ctrl.changeLanguage = function(lang) {
        $translate.use(lang);
        if (lang != undefined) {
          if (lang.length != 0) {
            GlobalServices.setCustomerPreferredLanguage(lang).then(function(lang) {
              window.location.reload();
            });
          }
        }
        if (lang == 'en') {
          ctrl.setLanguage = 'EN';
        }
        if (lang == 'sp') {
          ctrl.setLanguage = 'SP';
        }
      };
    }
  });
  