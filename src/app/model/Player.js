function Player(name, gold, color, priests, thinkers) {
  if (!priests) {
    priests = 0;
  }
  if (!thinkers) {
    thinkers = 0;
  }
  this.name = name;
  this.gold = gold;
  this.priests = priests;
  this.thinkers = thinkers;
  this.color = color;
}
new Player();
