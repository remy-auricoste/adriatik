var Territory = Meta.declareClass("Territory", {
  id: "",
  neighbours: ["Territory"],
  income: 1,
  type: "", // earth / sea
  troups: ["Unit"],
  buildings: ["Building"],
  buildSlots: 1,
  owner: "Player"
})
