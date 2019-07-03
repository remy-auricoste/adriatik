module.exports = function(Building, GodCard, UnitType, TerritoryType, Unit) {
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
      this.building = building;
      this.unitType = unitType;
      this.unitPrice = unitPrice;
      this.card = card;
      this.cardPrice = cardPrice;

      this.unitBuyCount = unitBuyCount;
      this.cardBuyCount = cardBuyCount;
      this.id = name.toLowerCase();
      this.index = index;
    }
    buyUnit({ territory, player, god = this, unitType = this.unitType }) {
      const { unitBuyCount } = god;
      try {
        if (!unitType) {
          throw new Error("ce dieu ne peut pas vous fournir d'unité.");
        }
        const price = god.unitPrice(god)[unitBuyCount];
        if (!price && price !== 0) {
          throw new Error("il n'y a plus d'unité à acheter.");
        }
        if (unitType.territoryType !== territory.type) {
          throw new Error(
            "il est impossible de placer ce type d'unité sur ce type de territoire."
          );
        }
        if (
          territory.getOwner() !== player.id &&
          territory.type === TerritoryType.earth
        ) {
          throw new Error(
            "vous ne pouvez acheter des unités terrestres que sur des territoires que vous contrôlez"
          );
        }
        if (
          !territory.isFriendly(player) &&
          territory.type === TerritoryType.sea
        ) {
          throw new Error(
            "vous ne pouvez acheter des unités maritimes que sur des territoires vides ou que vous contrôlez"
          );
        }
        if (territory.type === TerritoryType.sea) {
          const nearbyOwnedTerritories = territory
            .getNeighbours()
            .filter(territory2 => {
              return (
                territory2.type === TerritoryType.earth &&
                territory2.getOwner() === player.id
              );
            });
          if (!nearbyOwnedTerritories.length) {
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

    // private
    copy(params) {
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
