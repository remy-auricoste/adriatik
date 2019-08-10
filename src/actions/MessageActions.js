module.exports = function(storeCommands, store) {
  storeCommands.set("errorMessage", {});
  class MessageActions {
    getErrorMessage() {
      return store.getState().errorMessage;
    }
    setErrorMessage(message, duration = 5 * 1000) {
      const { display } = this.getErrorMessage();
      if (display) {
        this.resetMessages();
        setTimeout(() => {
          this.setErrorMessage(message, duration);
        }, 200);
        return;
      }
      storeCommands.set("errorMessage", {
        display: true,
        text: message,
        expirationDate: new Date().getTime() + duration
      });
      setTimeout(() => {
        const { expirationDate } = this.getErrorMessage();
        if (expirationDate < new Date().getTime()) {
          this.resetMessages();
        }
      }, duration);
    }
    resetMessages() {
      storeCommands.set("errorMessage.display", false);
    }
  }
  return new MessageActions();
};
