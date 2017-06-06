var Component = require("../core/Component");
var Arrays = require("rauricoste-arrays");

var XIf = require("./XIf");
var XIcon = require("./XIcon");

var XSesterces = Component({
  render: function() {
    var props = this.props;
    return (<div className={"XSesterces "+(props.stacked ? "stacked" : "")}>
        <XIf test={props.number > 0}>
          {
            Arrays.seq(0, props.number).map(i => {
              return (<XIcon
                        key={i}
                        fileName="sesterce"
                        size={props.size}
              />)
            })
          }
        </XIf>
        <XIf test={props.number === 0}>
          <XIcon fileName="sesterce"
                size={props.size}
                className="empty"
                />
          <div className="zero">0</div>
        </XIf>
    </div>)
  }
})

module.exports = XSesterces;
