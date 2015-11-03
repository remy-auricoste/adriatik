/** @ngInject */
function gameStorage() {
    'use strict';
    var key = window.location.pathname;

    return {
        save: function(object) {
          var saved = JSON.stringify(object);
          localStorage[key] = saved;
        },
        load: function() {
          var value = localStorage[key];
          if (!value) {
            return null;
          }
          value = JSON.parse(value);
          var game = Game.fromObject(value);
          // fix bids on gods
          game.players.map(function(player) {
            if (!player.bid) {
              return;
            }
            var god = God.byName(player.bid.godName);
            if (!god) {
              return;
            }
            if (!god.bid || god.bid.gold < player.bid.gold) {
              god.bid = player.bid;
            }
          })
          return game;
        }
    }
}

angular.module("adriatik").service("gameStorage", gameStorage);
