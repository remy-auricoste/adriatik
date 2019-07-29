class ActionBuilder {
  constructor() {
    this.selection = {};
  }
  select(params = {}) {
    Object.assign(this.selection, params);
  }
}
