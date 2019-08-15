const {
  BattleActions,
  DataTest,
  Game,
  GameActions,
  God,
  Unit,
  UnitType,
  Player
} = injector.resolveAll();

const { Minerve, Neptune } = God;
const { Legionnaire } = UnitType;

const { player, territory } = DataTest;

const actions = BattleActions;

const seq = (min, max) => {
  const result = [];
  for (let i = min; i < max; i++) {
    result.push(i);
  }
  return result;
};

const placeUnits = (territory, count, player) => {
  seq(0, count).forEach(() => {
    territory = territory.placeUnit(
      new Unit({
        type: Legionnaire,
        ownerId: player.id
      })
    );
  });
  return territory;
};

const initState = ({ player1UnitCount, player2UnitCount = 0 }) => {
  const player2 = new Player({ id: "player2" });
  let fromTerritory = territory;
  fromTerritory = placeUnits(fromTerritory, player1UnitCount, player);
  let toTerritory = territory.copy({ id: "toTerritory" });
  toTerritory = placeUnits(toTerritory, player2UnitCount, player2);
  fromTerritory.nextTo(toTerritory);

  let game = new Game({
    territories: [fromTerritory, toTerritory],
    players: [player, player2],
    gods: [Minerve, Neptune]
  });

  game = GameActions.placeBid({ game, godId: Minerve.id, amount: 1 });
  return GameActions.placeBid({ game, godId: Neptune.id, amount: 1 }).then(
    game => {
      return {
        player,
        player2,
        fromTerritory,
        toTerritory,
        game
      };
    }
  );
};

describe("BattleActions class", () => {
  describe("moveEarth method", () => {
    it("should move units from a territory to an empty territory", () => {
      return initState({ player1UnitCount: 3 }).then(init => {
        const { fromTerritory, toTerritory, game } = init;
        const { units } = fromTerritory;
        const movedUnits = [units[0], units[2]];
        return actions
          .moveEarth({
            game,
            units: movedUnits,
            fromTerritory,
            toTerritory
          })
          .then(result => {
            expect(result.getEntity(fromTerritory).units.length).to.equal(1);
            expect(result.getEntity(toTerritory).units.length).to.equal(2);
          });
      });
    });
    it("should move a unit and kill each other", () => {
      return initState({ player1UnitCount: 1, player2UnitCount: 1 }).then(
        init => {
          const { fromTerritory, toTerritory, game } = init;
          const { units } = fromTerritory;
          const movedUnits = units;
          return actions
            .moveEarth({
              game,
              units: movedUnits,
              fromTerritory,
              toTerritory
            })
            .then(game => {
              expect(game.getEntity(fromTerritory).units.length).to.equal(0);
              expect(game.getEntity(toTerritory).units.length).to.equal(0);
            });
        }
      );
    });
    it("should move units, fight and retreat", () => {
      return initState({ player1UnitCount: 2, player2UnitCount: 2 }).then(
        init => {
          let { fromTerritory, toTerritory, game, player } = init;
          const { units: movedUnits } = fromTerritory;
          const attacker = player;
          return actions
            .moveEarth({
              game,
              units: movedUnits,
              fromTerritory,
              toTerritory
            })
            .then(gameParam => {
              game = gameParam;
              const newFromT = game.getEntity(fromTerritory);
              const newToT = game.getEntity(toTerritory);
              expect(newFromT.units.length).to.equal(0);
              expect(newToT.units.length).to.equal(2);
              game = actions.retreat({
                player: attacker,
                game,
                toTerritory: newFromT
              });
              expect(game.battle.isDone()).to.equal(true);
            });
        }
      );
    });
    it("should move units, fight and defender should retreat", () => {
      return initState({ player1UnitCount: 2, player2UnitCount: 2 }).then(
        init => {
          const { fromTerritory, toTerritory, game, player2 } = init;
          const { units: movedUnits } = fromTerritory;
          const defender = player2;
          return actions
            .moveEarth({
              game,
              units: movedUnits,
              fromTerritory,
              toTerritory
            })
            .then(game => {
              const newFromT = game.getEntity(fromTerritory);
              game = actions.retreat({
                player: defender,
                game,
                toTerritory: newFromT
              });
              expect(game.battle.isDone()).to.equal(true);
            });
        }
      );
    });
    it("should move units, fight to death", () => {
      return initState({ player1UnitCount: 3, player2UnitCount: 3 }).then(
        init => {
          const { fromTerritory, toTerritory, game, player, player2 } = init;
          const { units: movedUnits } = fromTerritory;
          const defender = player2;
          const attacker = player;
          const countUnits = game => {
            return [
              game.getEntityById(toTerritory.id).getUnits(attacker).length,
              game.getEntityById(toTerritory.id).getUnits(defender).length
            ];
          };
          return actions
            .moveEarth({
              game,
              units: movedUnits,
              fromTerritory,
              toTerritory
            })
            .then(game => {
              expect(countUnits(game)).to.deep.equal([2, 2]);
              game = actions.stay({ game, player: attacker });
              return actions.stay({ game, player: defender });
            })
            .then(game => {
              expect(countUnits(game)).to.deep.equal([1, 1]);
              expect(game.battle.isDone()).to.equal(false);
              game = actions.stay({ game, player: attacker });
              return actions.stay({ game, player: defender });
            })
            .then(game => {
              expect(countUnits(game)).to.deep.equal([0, 0]);
              expect(game.battle.isDone()).to.equal(true);
            });
        }
      );
    });
    it("should throw an error as origin and destination are the same territory", () => {
      return initState({ player1UnitCount: 1 }).then(init => {
        const { fromTerritory, game } = init;
        const { units: movedUnits } = fromTerritory;
        return actions
          .moveEarth({
            game,
            units: movedUnits,
            fromTerritory,
            toTerritory: fromTerritory
          })
          .catch(err => {
            expect(err.message).to.equal(
              "vos troupes sont déjà sur ce territoire"
            );
          });
      });
    });
    it("should throw an error as there are no units", () => {
      return initState({ player1UnitCount: 1 }).then(init => {
        const { fromTerritory, toTerritory, game } = init;
        return actions
          .moveEarth({
            game,
            units: [],
            fromTerritory,
            toTerritory
          })
          .catch(err => {
            expect(err.message).to.equal("il n'y a aucune unité sélectionnée.");
          });
      });
    });
  });
});
