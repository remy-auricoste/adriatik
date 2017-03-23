var Injector = require("./Injector");

describe.only("Injector", function() {
  it("should handle dependancies with multiple layers", function() {
    var injector = new Injector();
    var layer1 = {a: 1};
    injector.register("layer1", layer1);
    var layer2 = function(layer1) {
      return {b: layer1.a + 1};
    }
    injector.register("layer2", ["layer1"], layer2);
    var instance2 = injector.getInstance("layer2");
    var instance2bis = injector.getInstance("layer2");
    expect(instance2.b).to.equal(2);
    expect(instance2).to.equal(instance2bis);
  })
})
