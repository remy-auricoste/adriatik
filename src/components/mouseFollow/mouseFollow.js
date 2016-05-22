/** @ngInject */
function mouseFollow() {
    return {
        restrict: 'E',
        templateUrl: "components/mouseFollow/mouseFollow.html",
        replace: true,
        transclude: true,
        scope: {
        },
        link: function (scope) {
          var offsetX = 15;
          var offsetY = 20;

          scope.onMove = function(event) {
            scope.top = event.clientY + offsetY;
            scope.left = event.clientX + offsetX;
            setTimeout(function() {
              scope.$apply();
            }, 0)
          }

          window.document.body.onmousemove = scope.onMove;
        }
    };
}

angular.module("adriatik").directive("mouseFollow", mouseFollow);
