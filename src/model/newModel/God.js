module.exports = function(Building, GodCard, UnitType, TerritoryType, Unit) {
  const { earth, sea } = TerritoryType;
  class God {
    constructor({
      name,
      building,
      unitType,
      unitPrice,
      card,
      cardPrice,
      unitBuyCount = 0,
      cardBuyCount = 0,
      index
    }) {
      this.name = name;
      this.building = building && new Building(building);
      this.unitType = unitType && new UnitType(unitType);
      this.unitPrice = unitPrice;
      this.card = card && new GodCard(card);
      this.cardPrice = cardPrice;

      this.unitBuyCount = unitBuyCount;
      this.cardBuyCount = cardBuyCount;
      this.id = name.toLowerCase();
      this.index = index;
      // fix functions when loading from JSON
      const godDef = God[name];
      if (godDef) {
        Object.assign(this, { unitPrice: godDef.unitPrice });
      }
    }
    init() {
      return this.copy({
        unitBuyCount: 0,
        cardBuyCount: 0
      });
    }
    buyUnit({ territory, player, game, god = this, unitType = this.unitType }) {
      const { unitBuyCount } = god;
      try {
        if (!unitType) {
          throw new Error("ce dieu ne peut pas vous fournir d'unité.");
        }
        const price = god.getUnitPrices()[unitBuyCount];
        if (!price && price !== 0) {
          throw new Error("il n'y a plus d'unité à acheter.");
        }
        if (unitType.territoryType.id !== territory.type.id) {
          throw new Error(
            "il est impossible de placer ce type d'unité sur ce type de territoire."
          );
        }
        if (!territory.isOwner(player) && territory.type === earth) {
          throw new Error(
            "vous ne pouvez acheter des unités terrestres que sur des territoires que vous contrôlez"
          );
        }
        if (!territory.isFriendly(player) && territory.type === sea) {
          throw new Error(
            "vous ne pouvez acheter des unités maritimes que sur des territoires vides ou que vous contrôlez"
          );
        }
        if (territory.type === sea) {
          const isNextEarthTerritory = game
            .getTerritoriesForPlayer(player)
            .find(
              territory2 =>
                territory2.type === earth && territory2.isNextTo(territory)
            );
          if (!isNextEarthTerritory) {
            throw new Error(
              "vous ne pouvez acheter des unités maritimes que sur des territoires situés à proximité d'un territoire terrestre que vous contrôlez"
            );
          }
        }
        return {
          player: player.spend(price),
          territory: territory.placeUnit(
            new Unit({ type: unitType, ownerId: player.id })
          ),
          god: god.copy({
            unitBuyCount: unitBuyCount + 1
          })
        };
      } catch (err) {
        throw err.prefix("Il est impossible d'acheter une unité : ");
      }
    }
    buyGodCard({ player, god = this }) {
      const { card, cardPrice, cardBuyCount } = god;
      try {
        if (!card) {
          throw new Error("ce dieu ne peut pas vous fournir de carte.");
        }
        const price = cardPrice[cardBuyCount];
        if (!price && price !== 0) {
          throw new Error("il n'y a plus de carte à acheter.");
        }
        return {
          player: player.spend(price).addGodCard(card),
          god: this.copy({
            cardBuyCount: cardBuyCount + 1
          })
        };
      } catch (err) {
        throw err.prefix("Il est impossible d'acheter une carte : ");
      }
    }
    build({ player, territory, building = this.building, god = this }) {
      try {
        if (!god) {
          throw new Error("vous n'avez sélectionné aucun dieu.");
        }
        if (!god.building) {
          throw new Error("ce dieu ne peut pas construire ce tour-ci.");
        }
        return {
          player: player.spend(2),
          territory: territory.build(building)
        };
      } catch (err) {
        throw err.prefix("Il est impossible de construire : ");
      }
    }

    // read
    getUnitPrices() {
      const { unitPrice } = this;
      if (!unitPrice) {
        return [];
      }
      return unitPrice(this);
    }

    // private
    copy(params = {}) {
      return new God(Object.assign({}, this, params));
    }
  }

  God.Jupiter = new God({
    name: "Jupiter",
    building: Building.Temple,
    card: GodCard.Priest,
    cardPrice: [0, 4]
  });
  God.Pluton = new God({
    name: "Pluton",
    unitType: UnitType.Gladiator,
    unitPrice: function(god) {
      if (god.index === 0) {
        return [0, 2];
      } else {
        return [2];
      }
    }
  });
  God.Pluton.canBuild = function() {
    return true;
  };
  God.Neptune = new God({
    name: "Neptune",
    building: Building.Port,
    unitType: UnitType.Ship,
    unitPrice: function() {
      return [0, 1, 2, 3];
    }
  });
  God.Junon = new God({
    name: "Junon",
    building: Building.University,
    card: GodCard.Philosopher,
    cardPrice: [0, 4]
  });
  God.Minerve = new God({
    name: "Minerve",
    building: Building.Fort,
    unitType: UnitType.Legionnaire,
    unitPrice: function() {
      return [0, 2, 3, 4];
    }
  });
  God.Ceres = new God({
    name: "Ceres"
  });

  return God;
};
