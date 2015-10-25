/** @ngInject */
function popinChat(gameSocket) {
    'use strict';
    var KEY_ENTER = 13;
    return {
        restrict: 'E',
        templateUrl: "app/components/popinChat/popinChat.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            scope.messages = new Fifo({size: 20});
            gameSocket.addListener(function(messageObj) {
                scope.messages.push(messageObj);
                scope.$apply();
            });
            gameSocket.send("salut");
            scope.toggle = function() {
              scope.closed = !scope.closed;
            }
            scope.send = function() {
              gameSocket.send(scope.text);
              scope.text = "";
            }
            scope.onKeyDown = function(event) {
              if (event.keyCode === KEY_ENTER) {
                scope.send();
              }
            }
        }
    };
}

angular.module("adriatik").directive("popinChat", popinChat);
