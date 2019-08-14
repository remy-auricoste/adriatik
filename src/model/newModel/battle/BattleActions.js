module.exports = function(
  TerritoryType,
  God,
  UnitType,
  Battle,
  BattleFSM,
  Commandify,
  BattleDecisions
) {
  const { stay, retreat } = BattleDecisions;
  const { sea, earth } = TerritoryType;
  const { Neptune, Ceres, Minerve } = God;
  class BattleActions {
    // TODO handle special ship moves
    async moveEarth({ game, units, fromTerritory, toTerritory }) {
      this.checkValidEarthMove({ game, units, fromTerritory, toTerritory });
      const defender = game.getEntityById(toTerritory.getOwner());
      const fromType = fromTerritory.type;
      const { player, god } = game.getCurrentPlayerAndGod();
      let newPlayer;
      if (fromType === sea || god.id === Minerve.id) {
        newPlayer = player.spend(1);
      } else {
        newPlayer = player
          .spend(player.gladiatorMoveCount + 1)
          .copy({ gladiatorMoveCount: player.gladiatorMoveCount + 1 });
      }
      const newTerritories = fromTerritory.moveUnits(units, toTerritory);
      const [fromNew, toNew] = newTerritories;
      let newGame = game
        .update(fromNew)
        .update(toNew)
        .update(newPlayer);
      if (!toNew.hasConflict()) {
        return newGame;
      }
      const battle = new Battle({
        territory: toNew,
        attacker: newPlayer,
        defender
      });
      const battleFsm = BattleFSM.build(battle);
      newGame = newGame.copy({ battle: battleFsm });
      return battleFsm.getReadyPromise().then(() => {
        const { attacker, defender, territory } = battleFsm.getState();
        return newGame
          .updateAll({ attacker, defender, territory })
          .copy({ battle: battleFsm });
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
      return game;
    }

    // reads
    checkValidEarthMove({ game, units, fromTerritory, toTerritory }) {
      this.checkNotSameTerritory({ fromTerritory, toTerritory });
      if (!units || !units.length) {
        throw new Error("il n'y a aucune unité sélectionnée.");
      }
      const allInTerritory = units.every(unit => {
        return fromTerritory.units.indexOf(unit) !== -1;
      });
      if (!allInTerritory) {
        throw new Error(
          "toutes les unités doivent partir du même territoire et arriver sur le même territoire"
        );
      }
      const { player, god } = game.getCurrentPlayerAndGod();
      if (god.id === Ceres.id) {
        throw new Error("Ceres ne peut pas déplacer d'unité.");
      }
      const gladiators = units.filter(
        unit => unit.type.id === UnitType.Gladiator.id
      );
      const fromType = fromTerritory.type;
      const isGodOk =
        (fromType === sea && god.id === Neptune.id) ||
        (fromType === earth && god.id === Minerve.id) ||
        (fromType === earth && gladiators.length);
      if (!isGodOk) {
        throw new Error("vous n'avez pas les faveurs du dieu correspondant.");
      }

      if (player.id !== units[0].ownerId) {
        throw new Error(`vous ne pouvez déplacer que vos propres unités`);
      }
      this.checkSeaConnected({ game, player, fromTerritory, toTerritory });
      this.checkValidTerritoryType({ units, territory: fromTerritory });
      this.checkValidTerritoryType({ units, territory: toTerritory });
    }
    checkValidRetreat({ game, player, fromTerritory, toTerritory }) {
      const units = fromTerritory.units.filter(
        unit => unit.ownerId === player.id
      );
      this.checkNotSameTerritory({ fromTerritory, toTerritory });
      this.checkFriendlyDestination({ player, territory: toTerritory });
      this.checkSeaConnected({ game, player, fromTerritory, toTerritory });
      this.checkValidTerritoryType({ units, territory: fromTerritory });
      this.checkValidTerritoryType({ units, territory: toTerritory });
    }

    // private
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
    checkNotSameTerritory({ fromTerritory, toTerritory }) {
      if (fromTerritory.id === toTerritory.id) {
        throw new Error("vos troupes sont déjà sur ce territoire");
      }
    }
    checkValidTerritoryType({ units, territory }) {
      const notValidUnit = units.find(unit => {
        return unit.type.territoryType.id !== territory.type.id;
      });
      if (notValidUnit) {
        throw new Error(
          `Unit of type ${
            notValidUnit.type.label
          } cannot go on territory of type ${territory.type}`
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
