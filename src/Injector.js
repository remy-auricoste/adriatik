class Injector {
  constructor() {
    this.files = {};
    this.resolved = {};
  }
  resolve(name, depChain = [name]) {
    if (depChain.indexOf(name) !== depChain.length - 1) {
      throw new Error(
        `circular dependancies detected : ${depChain.join("->")}`
      );
    }
    let resolved = this.resolved[name];
    if (resolved) {
      return resolved;
    }
    const file = this.files[name];
    if (!file) {
      throw new Error(
        `module ${name} is missing. It should be added first. depChain=${depChain.join(
          "->"
        )}`
      );
    }
    const depNames = this.parse(file);
    if (depNames) {
      const deps = depNames.map(dep => {
        return this.resolve(dep, depChain.concat([dep]));
      });
      resolved = file.apply(null, deps);
    } else {
      resolved = file;
    }
    this.resolved[name] = resolved;
    return resolved;
  }
  resolveAll() {
    const { files } = this;
    const result = {};
    Object.keys(files).forEach(key => {
      result[key] = this.resolve(key);
    });
    return result;
  }
  add(name, file) {
    if (this.files[name]) {
      throw new Error(`file ${name} already exists`);
    }
    if (!file) {
      throw new Error(`trying to add dep with name ${name} but got ${file}`);
    }
    this.files[name] = file;
  }
  addAll(object) {
    Object.keys(object).forEach(key => {
      this.add(key, object[key]);
    });
  }

  // private
  getDiRegex() {
    const space = "[ \t\n]*";
    const moduleName = `${space}[a-zA-Z]+${space}`;
    return new RegExp(
      `^function${space}\\(${moduleName}(,${moduleName})*\\)${space}\\{`,
      "g"
    );
  }
  parse(file) {
    const fctString = file.toString();
    if (!this.getDiRegex().test(fctString)) {
      return false;
    }
    const moduleNames = fctString
      .substring(fctString.indexOf("(") + 1, fctString.indexOf(")"))
      .split(",")
      .map(name => name.trim());
    return moduleNames;
  }
}

module.exports = Injector;
