var Command = require("../../model/data/Command");
var CommandType = require("../../model/data/CommandType");
var Phases = require("../../model/data/Phases");
var commandCenter = require("../../services/commandCenter");
var logger = require("../../alias/Logger").getLogger("actionPanel");

/** @ngInject */
function actionPanel($rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "components/actionPanel/actionPanel.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope) {
            scope.CommandType = CommandType;
            scope.iconSize = 20;
            scope.god = function () {
                return scope.game.getCurrentPlayer().god;
            }
            scope.selectMode = function(mode) {
                var selected = mode !== $rootScope.mode;
                logger.info("mode", mode, selected);
                var mode = selected ? mode : null;
                $rootScope.$emit("select.mode", mode);
                if (mode === CommandType.BuyCard) {
                  commandCenter.send(new Command({
                    type: mode
                  }));
                  $rootScope.$emit("select.mode", null);
                }
            }
            scope.endTurn = function () {
                commandCenter.send(new Command({type: CommandType.EndTurn}));
            }
            scope.Phases = Phases;
            scope.rootScope = $rootScope;
        }
    };
}

angular.module("adriatik").directive("actionPanel", actionPanel);
