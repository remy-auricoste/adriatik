/** @ngInject */
function game(randomFactory, qPlus, md5, gameSocket) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/game/game.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            scope.ready = false;
            var game = new Game({
                players: [
                    Player.new("Alain", md5.createHash("adoanhuu@gmail.com"), "red"),
                    Player.new("Alan", md5.createHash("alan.leruyet@free.fr"), "blue"),
                    Player.new("Charles", md5.createHash("chales.lescot@gmail.com"), "green"),
                    Player.new("Rémy", md5.createHash("remy.auricoste@gmail.com"), "purple")
                ],
                gods: God.all,
                randomFactory: randomFactory,
                showNotificationBox: false,
                message: "",
                q: qPlus
            });
            scope.game = game;
            game.startTurn().then(function () {
                scope.ready = true;
            });
        }
    };
}

angular.module("adriatik").directive("game", game);
