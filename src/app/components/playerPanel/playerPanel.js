angular.module("adriatik").directive("playerPanel", [function() {

    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/playerPanel/playerPanel.html",
            replace: true,
            scope: {
            },
            link: function(scope) {
              var models = window;
              // TODO pass as args instead of init here
              scope.players = [
                new models.Player("Remy", 7, "red"),
                new models.Player("Alain", 7, "blue"),
                new models.Player("Alan", 7, "green"),
                new models.Player("Charles", 7, "black")
              ];
              scope.currentPlayer = scope.players[0];
            }
        };
}]);
