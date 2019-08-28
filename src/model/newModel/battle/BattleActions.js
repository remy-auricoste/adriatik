module.exports = function(
  TerritoryType,
  God,
  UnitType,
  Battle,
  BattleFSM,
  BattleDecisions,
  UnitMove
) {
  const { stay, retreat } = BattleDecisions;
  const { sea, earth } = TerritoryType;
  const { Neptune, Ceres, Minerve } = God;
  class BattleActions {
    // TODO handle special ship moves
    moveEarth({ game, unitMoves }) {
      return Promise.resolve().then(() => {
        this.checkValidEarthMove({ game, unitMoves });
        return this.move({ game, unitMoves });
      });
    }
    moveSea({ game, unitMoves }) {
      return Promise.resolve().then(() => {
        this.checkValidSeaMove({ game, unitMoves });
        return this.move({ game, unitMoves });
      });
    }
    retreat({ game, player, toTerritory }) {
      this.checkForBattle({ game });
      const { battle } = game;
      const { territory: fromTerritory } = battle.getState();
      this.checkValidRetreat({ game, player, fromTerritory, toTerritory });
      const units = fromTerritory.units.filter(
        unit => unit.ownerId === player.id
      );
      const newTerritories = fromTerritory.moveUnits(units, toTerritory);
      const [fromNew, toNew] = newTerritories;
      battle.updateState(
        battle
          .getState()
          .makeDecision(player, retreat)
          .copy({ territory: fromNew })
      );
      return game.update(fromNew).update(toNew);
    }
    stay({ game, player }) {
      this.checkForBattle({ game });
      const { battle } = game;
      battle.updateState(battle.getState().makeDecision(player, stay));
      const { territory: territoryOld, attacker, defender } = battle.getState();
      const territory = game.getEntityById(territoryOld.id);
      if (battle.isDone() && territory.hasConflict()) {
        return this.initBattle({
          game,
          territory,
          attacker: game.getEntityById(attacker.id),
          defender: game.getEntityById(defender.id)
        });
      } else {
        return game;
      }
    }
    initBattle({ game, territory, attacker, defender }) {
      const battle = new Battle({
        territory,
        attacker,
        defender
      });
      const battleFsm = BattleFSM.build(battle);
      game = game.copy({ battle: battleFsm });
      return battleFsm.getReadyPromise().then(() => {
        const { attacker, defender, territory } = battleFsm.getState();
        return game
          .updateAll({ attacker, defender, territory })
          .copy({ battle: battleFsm });
      });
    }

    // reads
    checkValidEarthMove({ game, unitMoves }) {
      this.checkNotStupidMove({ game, unitMoves });
      this.checkValidGod({ game, unitMoves });

      const player = game.getCurrentPlayer();
      const { fromTerritory, toTerritory } = unitMoves[0];
      this.checkSeaConnected({ game, player, fromTerritory, toTerritory });
      this.checkValidTerritoryTypes({ unitMoves });
    }
    checkValidSeaMove({ game, unitMoves }) {
      this.checkNotStupidMove({ game, unitMoves });
      this.checkValidGod({ game, unitMoves });

      const player = game.getCurrentPlayer();
      unitMoves.forEach(({ fromTerritory, toTerritory }) => {
        this.checkSeaRange({
          game,
          fromTerritory,
          toTerritory,
          player
        });
      });
      this.checkValidTerritoryTypes({ unitMoves });
    }
    checkValidRetreat({ game, player, fromTerritory, toTerritory }) {
      this.checkNotSameTerritory({ fromTerritory, toTerritory });
      this.checkFriendlyDestination({ player, territory: toTerritory });
      this.checkSeaConnected({ game, player, fromTerritory, toTerritory });
      const units = fromTerritory.units.filter(
        unit => unit.ownerId === player.id
      );
      const unitMoves = units.map(
        unit => new UnitMove({ unit, fromTerritory, toTerritory })
      );
      this.checkValidTerritoryTypes({ unitMoves });
    }

    // private
    move({ game, unitMoves }) {
      const fromType = unitMoves[0].fromTerritory.type;
      const { player, god } = game.getCurrentPlayerAndGod();
      let newPlayer;
      if (fromType === sea || god.id === Minerve.id) {
        newPlayer = player.spend(1);
      } else {
        newPlayer = player
          .spend(player.gladiatorMoveCount + 1)
          .copy({ gladiatorMoveCount: player.gladiatorMoveCount + 1 });
      }
      let newGame = game.update(newPlayer);
      let battleTerritoryId;
      newGame = unitMoves.reduce((gameAcc, move) => {
        const result = move.apply(gameAcc);
        const toNew = result.getEntityById(move.toTerritory.id);
        if (toNew.hasConflict()) {
          battleTerritoryId = toNew.id;
        }
        return result;
      }, newGame);

      if (!battleTerritoryId) {
        return Promise.resolve(newGame);
      }
      const territory = newGame.getEntityById(battleTerritoryId);
      const defenderId = territory.units.find(
        unit => unit.ownerId !== newPlayer.id
      ).ownerId;
      const defender = newGame.getEntityById(defenderId);
      return this.initBattle({
        game: newGame,
        territory,
        attacker: newPlayer,
        defender
      });
    }
    checkNotStupidMove({ game, unitMoves }) {
      if (!unitMoves || !unitMoves.length) {
        throw new Error("il n'y a aucune unité sélectionnée.");
      }
      const { player, god } = game.getCurrentPlayerAndGod();
      if (god.id === Ceres.id) {
        throw new Error("Ceres ne peut pas déplacer d'unité.");
      }
      unitMoves.forEach(({ fromTerritory, toTerritory, unit }) => {
        this.checkNotSameTerritory({ fromTerritory, toTerritory });
        const inFromTerritory = fromTerritory.units.indexOf(unit) !== -1;
        if (!inFromTerritory) {
          throw new Error(
            `unit ${JSON.stringify(unit)} is not in territory ${JSON.stringify(
              fromTerritory
            )}`
          );
        }
        if (player.id !== unit.ownerId) {
          throw new Error(`vous ne pouvez déplacer que vos propres unités`);
        }
      });
      const aggressiveMoves = unitMoves
        .filter(({ toTerritory }) => {
          return !toTerritory.isFriendly(player);
        })
        .reduce((territoryArray, { toTerritory }) => {
          if (territoryArray.indexOf(toTerritory.id) === -1) {
            return territoryArray.concat([toTerritory.id]);
          } else {
            return territoryArray;
          }
        }, []);
      if (aggressiveMoves.length > 1) {
        throw new Error(
          `vous ne pouvez pas provoquer plus d'une bataille en vous déplaçant`
        );
      }

      // TODO move this for earth moves
      // throw new Error(
      //   "toutes les unités doivent partir du même territoire et arriver sur le même territoire"
      // );
    }
    checkValidGod({ game, unitMoves }) {
      const god = game.getCurrentGod();
      const gladiators = unitMoves
        .map(move => move.unit)
        .filter(unit => unit.type.id === UnitType.Gladiator.id);
      const fromType = unitMoves[0].fromTerritory.type;
      const isGodOk =
        (fromType === sea && god.id === Neptune.id) ||
        (fromType === earth && god.id === Minerve.id) ||
        (fromType === earth && gladiators.length);
      if (!isGodOk) {
        throw new Error("vous n'avez pas les faveurs du dieu correspondant.");
      }
    }
    checkFriendlyDestination({ territory, player }) {
      if (!territory.isFriendly(player)) {
        throw new Error(`le territoire est déjà contrôlé par un autre joueur`);
      }
    }
    checkSeaConnected({ game, player, fromTerritory, toTerritory }) {
      const isValidFct = territory =>
        territory.type === sea && territory.isOwner(player);
      if (!game.findPath({ fromTerritory, toTerritory, isValidFct })) {
        throw new Error(
          "le territoire de destination n'est pas adjacent au territoire de départ, ou relié par une chaîne de bateaux."
        );
      }
    }
    checkSeaRange({ game, player, fromTerritory, toTerritory }) {
      const maxMove = 3;
      const seaRange = this.getSeaRange({
        game,
        player,
        fromTerritory,
        toTerritory
      });
      if (seaRange === -1) {
        throw new Error(
          `il n'y a pas de chemin pour accéder au territoire de destination`
        );
      }
      if (seaRange > maxMove) {
        throw new Error(
          `vous ne pouvez vous déplacer que de ${maxMove} territoires`
        );
      }
      if (toTerritory.type !== sea) {
        throw new Error(`destination is not a sea territory !`);
      }
    }
    getSeaRange({ game, player, fromTerritory, toTerritory }) {
      const isValidFct = territory =>
        territory.type === sea && territory.isFriendly(player);
      const path = game.findPath({ fromTerritory, toTerritory, isValidFct });
      return !!path ? path.length - 1 : -1;
    }
    checkNotSameTerritory({ fromTerritory, toTerritory }) {
      if (fromTerritory.id === toTerritory.id) {
        throw new Error("vos troupes sont déjà sur ce territoire");
      }
    }
    checkValidTerritoryTypes({ unitMoves }) {
      unitMoves.forEach(({ unit, fromTerritory, toTerritory }) => {
        this.checkValidTerritoryType({ unit, territory: fromTerritory });
        this.checkValidTerritoryType({ unit, territory: toTerritory });
      });
    }
    checkValidTerritoryType({ unit, territory }) {
      const notValidUnit = unit.type.territoryType.id !== territory.type.id;
      if (notValidUnit) {
        throw new Error(
          `Unit of type ${unit.type.label} cannot go on territory of type ${
            territory.type
          }`
        );
      }
    }
    checkForBattle({ game }) {
      const { battle } = game;
      if (!battle) {
        throw new Error(`cannot retreat as there is no battle going on !`);
      }
    }
  }
  return new BattleActions();
};
