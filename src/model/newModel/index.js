const battle = require("./battle/index");
const fsm = require("./fsm/index");
const ActionBuilder = require("./ActionBuilder");
const Bid = require("./Bid");
const BidsState = require("./BidsState");
const Building = require("./Building");
const CreatureCard = require("./CreatureCard");
const CreatureMarket = require("./CreatureMarket");
const DataTest = require("./DataTest");
const Dice = require("./Dice");
const FirstTurnActions = require("./FirstTurnActions");
const Game = require("./Game");
const GameActions = require("./GameActions");
const GameSettings = require("./GameSettings");
const God = require("./God");
const GodCard = require("./GodCard");
const PhaseAction = require("./PhaseAction");
const PhaseBid = require("./PhaseBid");
const Player = require("./Player");
const Territory = require("./Territory");
const TerritoryType = require("./TerritoryType");
const Unit = require("./Unit");
const UnitType = require("./UnitType");
const jsDeps = {
	ActionBuilder,
	Bid,
	BidsState,
	Building,
	CreatureCard,
	CreatureMarket,
	DataTest,
	Dice,
	FirstTurnActions,
	Game,
	GameActions,
	GameSettings,
	God,
	GodCard,
	PhaseAction,
	PhaseBid,
	Player,
	Territory,
	TerritoryType,
	Unit,
	UnitType
}

module.exports = Object.assign({}, jsDeps, battle, fsm)