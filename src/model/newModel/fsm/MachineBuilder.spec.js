const MachineBuilder = require("./MachineBuilder");

describe("MachineBuilder class", () => {
  it("should execute 1 simple step", () => {
    let machine = new MachineBuilder()
      .step({
        name: "step1",
        action: ({ value }) => {
          return { value: value + 1 };
        },
        condition: ({ value }) => value % 2 === 0
      })
      .build();
    machine = machine.start();
    expect(machine.getCurrentStep().name).to.equal("step1");
    expect(machine.isDone()).to.equal(false);
    machine = machine.updateState({ value: 0 });
    expect(machine.getState()).to.deep.equal({ value: 1 });
    expect(machine.isDone()).to.equal(true);
    expect(machine.getCurrentStep()).to.equal(undefined);
  });
  it("should be buildable", () => {
    let machine = new MachineBuilder()
      .step({
        name: "step1",
        action: ({ value }) => {
          return { value: value + 1 };
        },
        condition: ({ value }) => value % 2 === 0
      })
      .step({
        name: "step2",
        condition: ({ value }) => value % 2 === 0,
        action: ({ value }) => {
          return { value: value * 10 };
        }
      })
      .build({ value: 0 });
    expect(machine.getCurrentStep().name).to.equal("step2");
    expect(machine.getState()).to.deep.equal({ value: 1 });
    machine = machine.updateState({ value: 5 });
    expect(machine.getCurrentStep().name).to.equal("step2");
    expect(machine.getState()).to.deep.equal({ value: 5 });
    machine = machine.updateState({ value: 4 });
    expect(machine.getState()).to.deep.equal({ value: 40 });
  });
  it("should chain several steps at once", () => {
    let machine = new MachineBuilder()
      .step({
        name: "step1",
        action: ({ value }) => {
          return { value: value + 1 };
        },
        condition: ({ value }) => value === 0
      })
      .step({
        name: "step2",
        action: ({ value }) => {
          return { value: value + 1 };
        },
        condition: ({ value }) => value === 1
      })
      .build({ value: 0 });
    expect(machine.getState()).to.deep.equal({ value: 2 });
    expect(machine.isDone()).to.equal(true);
  });
  it("should handle forks", () => {
    let machine = new MachineBuilder()
      .step({
        name: "start"
      })
      .step({
        name: "odd",
        condition: ({ value }) => value % 2 === 1,
        action: ({ value }) => {
          return { value: value * 13 };
        }
      })
      .step({
        name: "end"
      })
      .move("start")
      .step({
        name: "even",
        action: ({ value }) => {
          return { value: value * 2 };
        },
        condition: ({ value }) => value % 2 === 0
      })
      .join("end")
      .step({
        name: "add 1",
        action: ({ value }) => {
          return { value: value + 1 };
        }
      })
      .build();
    const machineEven = machine.copy().updateState({ value: 2 });
    expect(machineEven.getState()).to.deep.equal({ value: 5 });
    expect(machineEven.isDone()).to.deep.equal(true);

    const machineOdd = machine.copy().updateState({ value: 1 });
    expect(machineOdd.getState()).to.deep.equal({ value: 14 });
    expect(machineOdd.isDone()).to.deep.equal(true);
  });
  it("should handle asynchronous actions", () => {
    let machine = new MachineBuilder()
      .step({
        name: "start",
        action: state => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({ value: 2 });
            }, 30);
          });
        }
      })
      .step({
        action: state => {
          return { value: 3 };
        }
      })
      .build({ value: 1 });
    expect(machine.getState()).to.deep.equal({ value: 1 });
    return machine.getReadyPromise().then(() => {
      expect(machine.getState()).to.deep.equal({ value: 3 });
    });
  });
});
