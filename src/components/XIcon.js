var Component = require("../core/Component");

var XIcon = Component({
  render: function() {
    var props = this.props;
    return (<img src={"/images/"+props.fileName+".png"} width={props.size} height={props.size} />)
  }
})

module.exports = XIcon;
