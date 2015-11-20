/** @ngInject */
function helper($rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/helper/helper.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
          scope.isDisplayed = function() {
            var mode = $rootScope.mode;
            return mode && mode.select;
          }
          var messages = {
            Unit: "Veuillez sélectionner une unité",
            Territory: "Veuillez sélectionner un territoire",
            Player: "Veuillez sélectionner un joueur"
          }
          var messagesMulti = {
            Unit: "Veuillez sélectionner un groupe d'unités"
          }
          scope.getMessage = function() {
            if (!scope.isDisplayed()) {
              return "";
            }
            var mode = $rootScope.mode;
            if (mode.select.constructor === Array) {
              return messagesMulti[mode.select[0]];
            } else if (mode.select.constructor === String) {
              return messages[mode.select];
            }
          }
          scope.isMulti = function() {
            var mode = $rootScope.mode;
            return mode && mode.select && mode.select.constructor === Array;
          }
          scope.selectionValidate = function() {
            $rootScope.$emit("select", $rootScope.selectedUnits);
          }
        }
    };
}

angular.module("adriatik").directive("helper", helper);
