var Injector = require("./Injector");

describe("Injector", function() {
  it("should store and inject values", function() {
    var injector = new Injector();
    var object = {
      a: 1
    };
    injector.register("value", object);
    var injected = injector.resolve(["value"], function(value, plop) {
      return {
        value: value
      }
    })
    expect(injected.value).to.deep.equal(object);
  })
})
