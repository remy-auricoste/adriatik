const StepStore = require("./StepStore");

class FiniteStateMachine {
  constructor({
    state = {},
    currentSteps = [],
    history = [],
    promise = undefined,
    store = new StepStore()
  } = {}) {
    this.currentSteps = currentSteps;
    this.state = state;
    this.history = history;
    this.promise = promise;
    this.store = new StepStore(store);
  }
  start() {
    return this.checkNext();
  }
  checkNext() {
    const { state, currentSteps, history, store } = this;
    const nextStepName = currentSteps.find(stepName => {
      const step = store.getStep(stepName);
      return step.condition(state);
    });
    if (!nextStepName) {
      return this;
    }
    const nextStep = store.getStep(nextStepName);
    const { action, nexts, name } = nextStep;
    const newState = action(state);
    if (newState.constructor === Promise) {
      this.assign({
        promise: newState
      });
      newState.then(newStateReal => {
        this.assign({
          state: newStateReal,
          currentSteps: nexts,
          history: history.concat([name]),
          promise: undefined
        }).checkNext();
      });
      return this;
    } else {
      return this.assign({
        state: newState,
        currentSteps: nexts,
        history: history.concat([name])
      }).checkNext();
    }
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
    const { currentSteps } = this;
    const firstStepName = currentSteps[0];
    return firstStepName && this.store.getStep(firstStepName);
  }
  getHistory() {
    return this.history;
  }
  getState() {
    return this.state;
  }
  getReadyPromise() {
    return this.promise || Promise.resolve();
  }

  // private
  copy(params = {}) {
    return new FiniteStateMachine(Object.assign({}, this, params));
  }
  assign(params = {}) {
    return Object.assign(this, params);
  }
}

module.exports = FiniteStateMachine;
