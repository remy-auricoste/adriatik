/** @ngInject */
function neighbourFinder() {
    'use strict';
    return {
        getCorners: function (box) {
            return [
                {x: box.x, y: box.y},
                {x: box.x + box.width, y: box.y},
                {x: box.x + box.width, y: box.y + box.height},
                {x: box.x, y: box.y + box.height}
            ]
        },
        isInside: function (point, box) {
            return box.x <= point.x && point.x <= (box.x + box.width) && box.y <= point.y && point.y <= (box.y + box.height);
        },
        findNeighboursSimple: function (box, otherBoxes) {
            var self = this;
            var corners = self.getCorners(box);
            var result = [];
            for (var key in otherBoxes) {
                var otherBox = otherBoxes[key];
                var isOut = Meta.forall(corners, function (corner) {
                    return !self.isInside(corner, otherBox);
                });
                if (!isOut) {
                    result.push(key);
                }
            }
            return result;
        }
    }
}
angular.module("adriatik").service("neighbourFinder", neighbourFinder);


