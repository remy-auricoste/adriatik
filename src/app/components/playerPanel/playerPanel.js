/** @ngInject */
function playerPanel($window) {
    'use strict';
        return {
            restrict: 'E',
            templateUrl: "app/components/playerPanel/playerPanel.html",
            replace: true,
            scope: {
            },
            link: function(scope) {
              var models = $window;
              // TODO pass as args instead of init here
              scope.players = [
                Player.new("Remy", "red"),
                Player.new("Alain", "blue"),
                Player.new("Alan", "green"),
                Player.new("Charles", "black")
              ];
              scope.currentPlayer = scope.players[0];
            }
        };
}

angular.module("adriatik").directive("playerPanel", playerPanel);
