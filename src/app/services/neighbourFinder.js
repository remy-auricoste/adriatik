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
        findNeighboursSimple: function (territory, territories) {
            var self = this;
            var corners = self.getCorners(territory.box);
            return territories.filter(function(territoryIt) {
                var otherBox = territoryIt.box;
                var isOut = Meta.forall(corners, function (corner) {
                    return !self.isInside(corner, otherBox);
                });
                return !isOut;
            })
        }
    }
}
angular.module("adriatik").service("neighbourFinder", neighbourFinder);


