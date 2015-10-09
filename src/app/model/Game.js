require("./God");
require("./Player");
require("./Territory");

var Game = Meta.declareClass("Game", {
  territories: ["Territory"],
  gods: ["God"],
  players: ["Player"]
});
