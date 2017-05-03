var Component = require("../core/Component");

var XSesterces = require("./XSesterces");
var XIcon = require("./XIcon");

var XItemPrice = Component({
  render: function() {
    var price = this.props.price;
    return (<div className="XItemPrice">
      <div className="item-price">
          <XIcon file-name={this.props.iconName} size={this.props.iconSize} title={price + "sesterce(s)"} />
          <div>
            <XSesterces number={price} size={35} />
          </div>
      </div>

    </div>)
  }
})

module.exports = XItemPrice;
