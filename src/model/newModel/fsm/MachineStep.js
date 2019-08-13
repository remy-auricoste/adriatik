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
module.exports = MachineStep;
