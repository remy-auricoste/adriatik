class GodCard {
  constructor({ id, label }) {
    this.id = id;
    this.label = label;
  }
}
GodCard.Priest = new GodCard({
  id: "priest",
  label: "Prêtre"
});
GodCard.Philosopher = new GodCard({
  id: "philosopher",
  label: "Philosophe"
});

module.exports = GodCard;
