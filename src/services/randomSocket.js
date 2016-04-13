var gameSocket = require("./gameSocket");
module.exports = {
  hashSocket: gameSocket.subSocket("random-hash"),
  valueSocket: gameSocket.subSocket("random-value")
}


