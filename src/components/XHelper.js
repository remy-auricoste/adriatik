var Component = require("../core/Component");
var ClassObject = require("./ClassObject");

var Phases = require("../model/data/Phases");

var XHelper = Component({
  getSelectMessage: function(mode) {
    var messageKey = "select.";
    if (mode.select.constructor === Array) {
      return messageGetter(messageKey+"multi."+mode.select[0]);
    } else if (mode.select.constructor === String) {
      return messageGetter(messageKey+"single."+mode.select);
    }
  },
  isMulti: function() {
    var mode = store.getState().mode;
    return mode && mode.select && mode.select.constructor === Array;
  },
  selectionValidate: function() {
      // TODO
//    $rootScope.$emit("select", $rootScope.selectedUnits);
  },
  render: function() {
    var state = store.getState();
    var mode = state.mode;
    var game = state.game;
    var isPlacement = game.phase === Phases.actions && game.turn === 1;
    var isSelection = mode && !!mode.select;
    var isMulti = isSelection && mode.select.constructor === Array;
    var message;
    if (isSelection) {
      message = this.getSelectMessage(mode);
    }
    if (isPlacement) {
      message = messageGetter("placement");
    }

    return (<div className="XHelper">
      <div className="helper">
        <div className={"content "+ClassObject({hidden: !message})}>
          <div>{message}</div>
          <div className={ClassObject({hidden: !isMulti})}>
            <input type="button" value="Valider la sélection" onClick={this.selectionValidate} />
          </div>
        </div>
      </div>
    </div>)
  }
})

module.exports = XHelper;
