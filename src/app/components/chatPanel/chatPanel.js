/** @ngInject */
function chatPanel(gameSocket) {
    'use strict';
    var KEY_ENTER = 13;
    return {
        restrict: 'E',
        templateUrl: "app/components/chatPanel/chatPanel.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            var elem = elements[0];
            var messagesEl = elem.getElementsByClassName("messages")[0];
            scope.messages = new Fifo({size: 20});
            gameSocket.addListener(function(messageObj) {
                if (typeof messageObj.message === "string") {
                  scope.messages.push(messageObj);
                  scope.$apply();
                  messagesEl.scrollTop = messagesEl.scrollHeight;
                }
            });
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

angular.module("adriatik").directive("chatPanel", chatPanel);
