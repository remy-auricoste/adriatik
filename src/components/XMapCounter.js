var Component = require("../core/Component");
var ClassObject = require("./ClassObject");

var XIcon = require("./XIcon")

var XMapCounter = Component({
  render: function() {
    var props = this.props;
    return (<div className="XMapCounter">
      <div className={"map-counter "+ClassObject({hidden: !props.value})+" "+(props.className || "")}>
        <XIcon size={20} fileName={props.fileName} />
        <div className="count">{props.value}</div>
      </div>

    </div>)
  }
})

module.exports = XMapCounter;
