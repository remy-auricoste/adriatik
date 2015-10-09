require("./Player");
require("./Building");

var Territory = Meta.declareClass("Territory", {
  id: "",
  neighbours: ["Territory"],
  income: 1,
  type: "", // earth / sea
  troups: ["Troup"],
  buildings: ["Building"],
  buildSlots: 1,
  owner: "Player"
})
