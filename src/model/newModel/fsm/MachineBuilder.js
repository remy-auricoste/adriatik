const StepStore = require("./StepStore");
const FiniteStateMachine = require("./FiniteStateMachine");
const MachineStep = require("./MachineStep");

class MachineBuilder {
  constructor() {
    this.currentStep = undefined;
    this.firstStep = undefined;
    this.store = new StepStore();
  }
  step(stepParams) {
    const { currentStep, store } = this;
    const step = new MachineStep(stepParams);
    store.storeStep(step);
    if (currentStep) {
      currentStep.nexts.push(step.name);
    } else {
      this.firstStep = step.name;
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
    this.currentStep.nexts.push(step.name);
    this.currentStep = step;
    return this;
  }
  build(state = {}) {
    const { firstStep, store } = this;
    return new FiniteStateMachine({
      state,
      currentSteps: [firstStep],
      store
    }).start();
  }

  // private
  getStep(stepName) {
    return this.store.getStep(stepName);
  }
}

module.exports = MachineBuilder;
