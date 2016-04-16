var gameSocket = require("../../services/gameSocket");
var Fifo = require("../../model/tools/Fifo");

/** @ngInject */
function chatPanel() {
    var chatSocket = gameSocket.subSocket("chat");

    'use strict';
    var KEY_ENTER = 13;
    return {
        restrict: 'E',
        templateUrl: "components/chatPanel/chatPanel.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            scope.closed = true;

            var elem = elements[0];
            var messagesEl = elem.getElementsByClassName("messages")[0];
            scope.messages = new Fifo({size: 20});
            chatSocket.addListener(function(messageObj) {
                scope.messages.push(messageObj);
                scope.$apply();
                messagesEl.scrollTop = messagesEl.scrollHeight;
            });
            scope.toggle = function() {
              scope.closed = !scope.closed;
            }
            scope.send = function() {
              chatSocket.send(scope.text);
              scope.text = "";
            }
            scope.onKeyDown = function(event) {
              if (event.keyCode === KEY_ENTER) {
                scope.send();
              }
            }
            scope.strip = function(string, size) {
              if (string && string.length > size) {
                return string.substring(0, size)+"...";
              }
              return string;
            }
        }
    };
}

angular.module("adriatik").directive("chatPanel", chatPanel);
