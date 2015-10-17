'use strict';

describe("Game class", function() {
  var game;
  var player;
  beforeEach(function() {
    player = new Player();
    game = new Game({
      players: [player]
    });
  });

  describe("receiveCommand method", function() {
    it("should receive a build command", function() {
      var calledArg;
      player.build = function(arg) {
        calledArg = arg;
      }
      game.receiveCommand(new Command({
        type: CommandType.Build,
        player: player,
        args: ["test"]
      }));
      expect(calledArg).toBe("test");
    });
  })
})
