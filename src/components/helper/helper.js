var Phases = require("../../model/data/Phases");
var messageGetter = require("../../messages");

/** @ngInject */
function helper($rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "components/helper/helper.html",
        replace: true,
        scope: {
          game: "="
        },
        link: function (scope, elements, attr) {
          scope.isDisplayed = function() {
            return scope.isSelection() || scope.isPlacement();
          }
          scope.isSelection = function() {
            var mode = $rootScope.mode;
            return mode && mode.select;
          }
          scope.isPlacement = function() {
            return scope.game.phase === Phases.actions && scope.game.turn === 1;
          }
          scope.getMessage = function() {
            if (!scope.isDisplayed()) {
              return "";
            }
            if (scope.isSelection()) {
              return scope.getSelectMessage();
            }
            if (scope.isPlacement()) {
              return messageGetter("placement");
            }
          }
          scope.getSelectMessage = function() {
            var mode = $rootScope.mode;
            var messageKey = "select.";
            if (mode.select.constructor === Array) {
              return messageGetter(messageKey+"multi."+mode.select[0]);
            } else if (mode.select.constructor === String) {
              return messageGetter(messageKey+"single."+mode.select);
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
