var injector = require("../core/MyInjector");

var God = require("../model/data/God");

var mapGenerator = require("./mapGenerator");
var neighbourFinder = require("./neighbourFinder");

var accounts = [
  {name: "Alain", email: "adoanhuu@gmail.com"},
  {name: "Alan", email: "alan.leruyet@free.fr"},
  {name: "Charles", email: "chales.lescot@gmail.com"},
  {name: "Rémy", email: "remy.auricoste@gmail.com"},
  {name: "Baptiste", email: "bapt@gmail.com"}
];

injector.register("GameCreator", [
  "Game",
  "Player"
], function(Game, Player) {
  var GameCreator = {
      create: function(playerCount) {
          var players = accounts.slice(0, playerCount).map(account => { return new Player(account) });
          var game = new Game({
            players: players,
            gods: God.allArray(),
            warMode: false
          });

          return mapGenerator.getTerritories("standard").then(function(territories) {
            territories.map(function (territory) {
              var neighbours = neighbourFinder.findRealNeighbours(territory, territories);
              neighbours.map(function (neighbour) {
                if (neighbour === territory) {
                  return;
                }
                territory.nextTo(neighbour);
              })
            });
            return territories;
          }).then(function (territories) {
            game.territories = territories;
            return game.startTurn();
          });
      }
  }
  return GameCreator;

})
