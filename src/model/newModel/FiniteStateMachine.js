class MachineStep {
  constructor({
    action = state => state,
    condition = () => true,
    name = Math.random().toString(),
    nexts = []
  } = {}) {
    this.action = action;
    this.condition = condition;
    this.name = name;
    this.nexts = nexts;
  }
}

class FiniteStateMachine {
  constructor({ state = {}, currentSteps = [], history = [] } = {}) {
    this.currentSteps = currentSteps;
    this.state = state;
    this.history = history;
  }
  start() {
    return this.checkNext();
  }
  checkNext() {
    const { state, currentSteps, history } = this;
    const nextStep = currentSteps.find(step => {
      return step.condition(state);
    });
    if (!nextStep) {
      return this;
    }
    const { condition, action, nexts, name } = nextStep;
    if (condition(state)) {
      const newState = action(state);
      if (newState.constructor === Promise) {
        newState.then(newStateReal => {
          this.assign({
            state: newStateReal,
            currentSteps: nexts,
            history: history.concat([name])
          }).checkNext();
        });
      } else {
        return this.assign({
          state: newState,
          currentSteps: nexts,
          history: history.concat([name])
        }).checkNext();
      }
    }
    return this;
  }
  updateState(newState) {
    return this.assign({
      state: newState
    }).checkNext();
  }
  assignState(extendedState) {
    return this.updateState(Object.assign({}, this.state, extendedState));
  }

  // reads
  isDone() {
    return !this.currentSteps.length;
  }
  getCurrentStep() {
    return this.currentSteps[0];
  }
  copy(params = {}) {
    return new FiniteStateMachine(Object.assign({}, this, params));
  }
  assign(params = {}) {
    return Object.assign(this, params);
  }
  getHistory() {
    return this.history;
  }
}

class MachineBuilder {
  constructor() {
    this.currentStep = undefined;
    this.firstStep = undefined;
    this.stepMap = {};
  }
  step(stepParams) {
    const { currentStep, stepMap } = this;
    const step = new MachineStep(stepParams);
    stepMap[step.name] = step;
    if (currentStep) {
      currentStep.nexts.push(step);
    } else {
      this.firstStep = step;
    }
    this.currentStep = step;
    return this;
  }
  move(stepName) {
    const step = this.getStep(stepName);
    this.currentStep = step;
    return this;
  }
  join(stepName) {
    const step = this.getStep(stepName);
    this.currentStep.nexts.push(step);
    this.currentStep = step;
    return this;
  }
  build(state = {}) {
    const { firstStep } = this;
    return new FiniteStateMachine({ state, currentSteps: [firstStep] }).start();
  }

  // private
  getStep(stepName) {
    const { stepMap } = this;
    const step = stepMap[stepName];
    if (!step) {
      throw new Error(`could not find step with name ${stepName}`);
    }
    return step;
  }
}

const subExports = { FiniteStateMachine, MachineStep };
module.exports = Object.assign(MachineBuilder, subExports);
