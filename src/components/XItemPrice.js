var Component = require("../core/Component");

var XSesterces = require("./XSesterces");
var XIcon = require("./XIcon");

var XItemPrice = Component({
  render: function() {
    var price = this.props.price;
    return (<div className={"XItemPrice "+(this.props.className || "")}>
          <XIcon fileName={this.props.iconName} size={this.props.iconSize} title={price + "sesterce(s)"} />
          <div>
            <XSesterces number={price} size={this.props.iconSize} />
          </div>
    </div>)
  }
})

module.exports = XItemPrice;
