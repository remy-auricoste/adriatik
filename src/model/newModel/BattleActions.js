module.exports = function(TerritoryType, God, UnitType) {
  const { sea, earth } = TerritoryType;
  const { Neptune, Ceres, Minerve } = God;
  return class BattleActions {
    move({ game, units, fromTerritory, toTerritorry }) {
      this.checkValidEarthMove({ game, units, fromTerritory, toTerritorry });
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
      return { player: newPlayer };
    }

    // reads
    checkValidEarthMove({ game, units, fromTerritory, toTerritorry }) {
      if (fromTerritory === toTerritorry) {
        throw new Error("vos troupes sont déjà sur ce territoire");
      }
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
      const gladiators = units.filter(unit => unit.type === UnitType.Gladiator);
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
      const isValidFct = territory =>
        territory.type === sea && territory.isOwner(player);
      if (!game.findPath({ fromTerritory, toTerritorry, isValidFct })) {
        throw new Error(
          "le territoire de destination n'est pas adjacent au territoire de départ, ou relié par une chaîne de bateaux."
        );
      }
    }
  };
  
  //   resolveMove: function (units, fromTerritory, toTerritorry) {
  //     var self = this;
  //     fromTerritory.moveUnits(units, toTerritorry);
  //     if (toTerritorry.hasConflict()) {
  //       return self.generateBattle(toTerritorry);
  //     } else {
  //       toTerritorry.owner = self;
  //     }
  // },
  // generateBattle: function(territory) {
  //     return randomReaderAsync.nextNRandoms(2).then(function (randoms) {
  //         var battle = Battle.new(randoms, territory);
  //         logger.debug("battle", battle);
  //         return battle;
  //     });
  // },
  // resolveBattle: function(battle, options) {
  //     if (options.unit) {
  //       logger.info("resolveBattle : removing unit");
  //       battle.territory.removeUnit(options.unit);
  //       battle.getState(this).setLoss(options.unit);
  //     }
  //     if (options.retreatTerritory) {
  //       logger.info("resolveBattle : retreating...");
  //       this.retreat(battle.territory, options.retreatTerritory);
  //       battle.getState(this).retreat();
  //     }
  //     if (options.stay) {
  //       battle.getState(this).stay();
  //     }
  //     logger.info("battle fully resolved", battle.isFullyResolved());
  //     if (battle.isFullyResolved()) {
  //       if (battle.territory.hasConflict()) {
  //         logger.info("no retreats, generating new battle");
  //         return this.generateBattle(battle.territory);
  //       } else {
  //         var units = battle.territory.units;
  //         if (units.length) {
  //           battle.territory.owner = units[0].owner;
  //         }
  //         logger.info("battle is over");
  //         return true; // battle is over
  //       }
  //     }
  // },
  // possibleRetreats: function (territory) {
  //     var self = this;
  //     return Territory.allArray().filter(function(territory2) {
  //       return territory2.isFriendly(self) && (territory.isNextTo(territory2) || !!self.findPathBySea(territory, territory2));
  //     });
  // },
  // retreat: function (fromTerritory, toTerritorry) {
  //     var self = this;
  //     try {
  //         if (fromTerritory.type !== toTerritorry.type) {
  //             throw new Error("le territoire de départ et de destination doivent être du même type.");
  //         }
  //         if (this.possibleRetreats(fromTerritory).indexOf(toTerritorry) === -1) {
  //             throw new Error("cette retraite n'est pas valide. Veuillez choisir un territoire que vous contrôlez ou inoccupé.");
  //         }
  //         var units = fromTerritory.getUnits(self);
  //         return this.resolveMove(units, fromTerritory, toTerritorry);
  //     } catch (err) {
  //         throw err.prefix("Il est impossible de retraiter : ");
  //     }
  // },
};