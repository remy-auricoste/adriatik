var isEnabled = !!(window.history && window.history.pushState);

var History = {
    saveState: function(state) {
        if (!isEnabled) {
            return;
        }
        window.history.pushState(state, window.document.title);
    },
    getState: function() {
        if (!isEnabled) {
            return;
        }
        return window.history.state;
    }
}

module.exports = History;
