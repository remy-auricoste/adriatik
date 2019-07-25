module.exports = function(FiniteStateMachine) {
  const addLossSteps = (machine, playerKey) => {
    const start = `start loss ${playerKey}`;
    const end = `end loss ${playerKey}`;
    return machine
      .step({ name: start })
      .step({
        name: `auto loss ${playerKey}`,
        condition: state => {
          const player = state[playerKey];
          return state.isAutoLossPossible(player);
        },
        action: state => {
          const { territory } = state;
          const player = state[playerKey];
          const units = territory.getUnits(player);
          const firstUnit = units[0];
          const newTerritory = territory.removeUnit(firstUnit);
          return state.resolveLoss(player).copy({ territory: newTerritory });
        }
      })
      .step({ name: end })
      .move(start)
      .step({
        name: `manual loss ${playerKey}`,
        condition: state => {
          const player = state[playerKey];
          const playerState = state.getState(player);
          return playerState.loss && state.isLossResolved(player);
        }
      })
      .join(end)
      .move(start)
      .step({
        name: `no loss ${playerKey}`,
        condition: state => {
          const player = state[playerKey];
          const playerState = state.getState(player);
          return !playerState.loss;
        }
      })
      .join(end);
  };

  const addDecisionSteps = (machine, playerKey) => {
    const start = `start decision ${playerKey}`;
    const end = `end decision ${playerKey}`;
    return machine
      .step({ name: start })
      .step({
        name: `no decision ${playerKey}`,
        condition: state => {
          const player = state[playerKey];
          return !state.shouldMakeDecision(player);
        },
        action: state => {
          const player = state[playerKey];
          return state.makeDecision(player, "all dead");
        }
      })
      .step({ name: end })
      .move(start)
      .step({
        name: `make decision ${playerKey}`,
        condition: state => {
          const player = state[playerKey];
          return state.hasMadeDecision(player);
        }
      })
      .join(end);
  };

  let machine = new FiniteStateMachine().step({
    name: "start",
    action: state => {
      return state.buildLosses();
    }
  });
  machine = addLossSteps(machine, "attacker");
  machine = addLossSteps(machine, "defender");
  machine = addDecisionSteps(machine, "attacker");
  machine = addDecisionSteps(machine, "defender");
  return machine;
};
