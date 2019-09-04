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
  Territory,
  UnitMove
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

const initSeaState = ({ territoryCount, player1UnitCount = 1 } = {}) => {
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
  return { game, territories, player };
};

describe("BattleActions class", () => {
  describe("moveEarth method", () => {
    it("should move units from a territory to an empty territory", () => {
      return initState({ player1UnitCount: 3 }).then(init => {
        const { fromTerritory, toTerritory, game } = init;
        const { units } = fromTerritory;
        const movedUnits = [units[0], units[2]];
        const unitMoves = movedUnits.map(
          unit => new UnitMove({ unit, fromTerritory, toTerritory })
        );
        return actions
          .moveEarth({
            game,
            unitMoves
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
          const unitMoves = movedUnits.map(
            unit => new UnitMove({ unit, fromTerritory, toTerritory })
          );
          return actions
            .moveEarth({
              game,
              unitMoves
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
          const unitMoves = movedUnits.map(
            unit => new UnitMove({ unit, fromTerritory, toTerritory })
          );
          return actions
            .moveEarth({
              game,
              unitMoves
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
          const unitMoves = movedUnits.map(
            unit => new UnitMove({ unit, fromTerritory, toTerritory })
          );
          return actions
            .moveEarth({
              game,
              unitMoves
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
          const unitMoves = movedUnits.map(
            unit => new UnitMove({ unit, fromTerritory, toTerritory })
          );
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
              unitMoves
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
        const unitMoves = movedUnits.map(
          unit =>
            new UnitMove({ unit, fromTerritory, toTerritory: fromTerritory })
        );
        return actions
          .moveEarth({
            game,
            unitMoves
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
        const { game } = init;
        return actions
          .moveEarth({
            game,
            unitMoves: []
          })
          .catch(err => {
            expect(err.message).to.equal("il n'y a aucune unité sélectionnée.");
          });
      });
    });
  });
  describe("getSeaRange method", () => {
    it("should return 3 if target territory is 3 territories away", () => {
      const { game, territories, player } = initSeaState({ territoryCount: 4 });
      expect(
        actions.getSeaRange({
          game,
          player,
          fromTerritory: territories[0],
          toTerritory: territories[territories.length - 1]
        })
      ).to.equal(3);
    });
    it("should return 4 if target territory is 4 territories away", () => {
      const { game, territories, player } = initSeaState({ territoryCount: 5 });
      expect(
        actions.getSeaRange({
          game,
          player,
          fromTerritory: territories[0],
          toTerritory: territories[territories.length - 1]
        })
      ).to.equal(4);
    });
    it("should return 1 if target territory is 1 territories away", () => {
      const { game, territories, player } = initSeaState({ territoryCount: 2 });
      expect(
        actions.getSeaRange({
          game,
          player,
          fromTerritory: territories[0],
          toTerritory: territories[territories.length - 1]
        })
      ).to.equal(1);
    });
    it("should return -1 if territories are not sea connected", () => {
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
        actions.getSeaRange({
          game,
          player,
          fromTerritory,
          toTerritory
        })
      ).to.equal(-1);
    });
  });
  describe("checkShareSamePath", () => {
    const initMoveSeaState = ({
      territoryCount,
      shipCount = 3,
      startTerritoryIndex
    }) => {
      let { game, territories, player } = initSeaState({ territoryCount });
      let startTerritory = territories[startTerritoryIndex];
      startTerritory = placeUnits({
        territory: startTerritory,
        count: shipCount,
        player,
        unitType: Ship
      });
      game = game.update(startTerritory);
      return { game, startTerritory, player, territories };
    };

    it("should not throw if the path is valid and has a length <= 3", () => {
      const { game, territories, startTerritory } = initMoveSeaState({
        territoryCount: 4,
        startTerritoryIndex: 0
      });
      const unitMoves = startTerritory.units.map(
        (unit, unitIndex) =>
          new UnitMove({
            unit,
            fromTerritory: startTerritory,
            toTerritory: territories[unitIndex + 1]
          })
      );
      const orderedTerritories = [
        startTerritory,
        startTerritory,
        startTerritory,
        territories[1],
        territories[2],
        territories[3]
      ];

      expect(
        actions.checkShareSamePath({
          game,
          unitMoves,
          orderedTerritories
        })
      ).to.equal(undefined);
    });
    it("should not throw if doing an aller-retour with the ships", () => {
      const { game, territories, startTerritory } = initMoveSeaState({
        territoryCount: 3,
        startTerritoryIndex: 1,
        shipCount: 2
      });
      const { units } = startTerritory;
      const unitMoves = [
        new UnitMove({
          unit: units[0],
          fromTerritory: startTerritory,
          toTerritory: territories[0]
        }),
        new UnitMove({
          unit: units[1],
          fromTerritory: startTerritory,
          toTerritory: territories[2]
        })
      ];
      const orderedTerritories = [
        startTerritory,
        startTerritory,
        territories[0],
        territories[2]
      ];

      expect(
        actions.checkShareSamePath({
          game,
          unitMoves,
          orderedTerritories
        })
      ).to.equal(undefined);
    });
    it("should throw if doing an aller-retour with the ships that 4 territories long", () => {
      const { game, territories, startTerritory } = initMoveSeaState({
        territoryCount: 4,
        startTerritoryIndex: 1,
        shipCount: 2
      });
      const { units } = startTerritory;
      const unitMoves = [
        new UnitMove({
          unit: units[0],
          fromTerritory: startTerritory,
          toTerritory: territories[0]
        }),
        new UnitMove({
          unit: units[1],
          fromTerritory: startTerritory,
          toTerritory: territories[3]
        })
      ];
      const orderedTerritories = [
        startTerritory,
        startTerritory,
        territories[0],
        territories[3]
      ];

      expect(() =>
        actions.checkShareSamePath({
          game,
          unitMoves,
          orderedTerritories
        })
      ).to.throw("vous ne pouvez vous déplacer que de 3 territoires");
    });
  });
});
