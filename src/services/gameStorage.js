var Game = require("../model/data/Game");
var God = require("../model/data/God");
var logger = require("../alias/Logger").getLogger("gameStorage");

var key = window.location.pathname;

var gameStorage = {
    save: function(object, name) {
      name = name ? name : key;
      var saved = JSON.stringify(object);
      localStorage[name] = saved;
    },
    load: function(name) {
      name = name ? name : key;
      var value = localStorage[name];
      if (!value) {
        return null;
      }
      value = JSON.parse(value);
      logger.info("json game", value);
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
    },
    copy: function(source, dest) {
      localStorage[dest] = localStorage[source];
    },
    delete: function() {
      delete localStorage[key];
      window.location.reload(true);
    },
    defaultName: key
}

module.exports = gameStorage;
