const {
  BattleActions,
  DataTest,
  Game,
  GameActions,
  God,
  Unit,
  UnitType,
  Player,
  TerritoryType,
  Arrays,
  Territory
} = injector.resolveAll();

const { sea, earth } = TerritoryType;
const { Minerve, Neptune } = God;
const { Legionnaire, Ship } = UnitType;
const { player, territory } = DataTest;
const actions = BattleActions;
const seq = Arrays.seq;

const placeUnits = ({ territory, count, player, unitType }) => {
  seq(0, count).forEach(() => {
    territory = territory.placeUnit(
      new Unit({
        type: unitType,
        ownerId: player.id
      })
    );
  });
  return territory;
};

const createConnectedTerritories = ({ count, type }) => {
  const territories = seq(0, count).map(i => {
    return new Territory({ id: "territory" + i, type });
  });
  territories.reduce((a, b) => {
    a && b.nextTo(a);
    return b;
  }, undefined);
  return territories;
};
const addUnits = ({
  territories,
  player1,
  player1UnitCount,
  player2 = undefined,
  player2UnitCount = undefined,
  unitType
}) => {
  territories[0] = placeUnits({
    territory: territories[0],
    player: player1,
    count: player1UnitCount,
    unitType
  });
  if (player2) {
    territories[territories.length - 1] = placeUnits({
      territory: territories[territories.length - 1],
      player: player2,
      count: player2UnitCount,
      unitType
    });
  }
  return territories;
};

const initState = ({ player1UnitCount, player2UnitCount = 0 }) => {
  const player2 = new Player({ id: "player2" });
  const territories = createConnectedTerritories({ count: 2, type: earth });
  const [fromTerritory, toTerritory] = addUnits({
    territories,
    player1: player,
    player1UnitCount,
    player2,
    player2UnitCount,
    unitType: Legionnaire
  });

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

initSeaState = ({ territoryCount, player1UnitCount = 1 } = {}) => {
  let territories = createConnectedTerritories({
    count: territoryCount,
    type: sea
  });
  territories = addUnits({
    territories,
    player1: player,
    player1UnitCount,
    unitType: Ship
  });

  const game = new Game({
    territories,
    players: [player],
    gods: [Minerve, Neptune]
  });
  return { game, territories };
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
  describe("isWithinSeaRange method", () => {
    it("should return true if target territory is 3 territories away", () => {
      const { game, territories, player } = initSeaState({ territoryCount: 4 });
      expect(
        actions.isWithinSeaRange({
          game,
          player,
          fromTerritory: territories[0],
          toTerritory: territories[territories.length - 1]
        })
      ).to.equal(true);
    });
    it("should return true if target territory is 4 territories away", () => {
      const { game, territories, player } = initSeaState({ territoryCount: 5 });
      expect(
        actions.isWithinSeaRange({
          game,
          player,
          fromTerritory: territories[0],
          toTerritory: territories[territories.length - 1]
        })
      ).to.equal(false);
    });
    it("should return true if target territory is 1 territories away", () => {
      const { game, territories, player } = initSeaState({ territoryCount: 2 });
      expect(
        actions.isWithinSeaRange({
          game,
          player,
          fromTerritory: territories[0],
          toTerritory: territories[territories.length - 1]
        })
      ).to.equal(true);
    });
    it("should return false if territories are not sea connected", () => {
      let fromTerritory = new Territory({ type: sea });
      let toTerritory = new Territory({ type: sea });
      fromTerritory = fromTerritory.placeUnit(
        new Unit({ type: Ship, ownerId: player.id })
      );
      const territories = [fromTerritory, toTerritory];

      const game = new Game({
        territories,
        players: [player],
        gods: [Minerve, Neptune]
      });
      expect(
        actions.isWithinSeaRange({
          game,
          player,
          fromTerritory,
          toTerritory
        })
      ).to.equal(false);
    });
  });
});
