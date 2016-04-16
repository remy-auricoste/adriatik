var cron = require("../../services/cron");
var Dice = require("../../model/data/Dice");
var RandomWrapper = require("../../model/tools/RandomWrapper");

/** @ngInject */
function dicePanel($timeout) {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: "components/dicePanel/dicePanel.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            var diceEl = elements[0].getElementsByClassName("dice")[0];
            scope.random = "show-front";
            var resultAngles = {
              1: {x: 0, y: 0},
              2: {x: 180, y: 0},
              3: {x: 0, y: 270},
              0: {x: 90, y: 0}
            }


            var angles = {
              x:0,
              y:0
            }
            var getRandomAngle = function() {
              return new RandomWrapper({value: Math.random()}).nextInt(10, 360);
            }
            var setAngles = function(duration) {
              diceEl.style.transform = "rotateX("+angles.x+"deg) rotateY("+angles.y+"deg)";
              diceEl.style.transition = duration+"s";
            }

            scope.throwDice = function(result) {
              if (result === undefined) {
                result = Dice(Math.random());
              }
              Array.seq(1, 5).map(function(index) {
                angles.x += getRandomAngle();
                angles.y += getRandomAngle();
                setAngles(0.5);
              });
              $timeout(function() {
                angles.x += getRandomAngle();
                angles.y += getRandomAngle();
                setAngles(0.5);
              }, 200);
              $timeout(function() {
                var turnsX = Math.floor(angles.x / 360);
                var turnsY = Math.floor(angles.y / 360);
                var leftX = angles.x % 360;
                var leftY = angles.y % 360;
                var targetX = resultAngles[result].x;
                var targetY = resultAngles[result].y;

                angles.x = turnsX * 360 + targetX;
                angles.y = turnsY * 360 + targetY;
                if (leftX > targetX) {
                  angles.x += 360;
                }
                if (leftY > targetY) {
                  angles.y += 360;
                }
                setAngles(0.4);
              }, 500);
            }
        }
    };
}

angular.module("adriatik").directive("dicePanel", dicePanel);
