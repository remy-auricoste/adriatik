const MachineStep = require("./MachineStep");

class StepStore {
  constructor({ steps = {} } = {}) {
    const builtAllSteps = {};
    Object.keys(steps).forEach(stepName => {
      builtAllSteps[stepName] = new MachineStep(steps[stepName]);
    });
    this.steps = builtAllSteps;
  }
  storeStep(step) {
    const { steps } = this;
    const { name } = step;
    if (steps[name]) {
      throw new Error(
        `step with name ${name} already exist. Please change the step name`
      );
    }
    steps[name] = new MachineStep(step);
  }
  getStep(stepName) {
    const { steps } = this;
    const step = steps[stepName];
    if (!step) {
      throw new Error(`could not find step with name=${stepName}`);
    }
    return step;
  }
}

module.exports = StepStore;
