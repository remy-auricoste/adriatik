var Component = require("../core/Component");

var XIf = Component({
  render: function() {
    return (<div className="XIf">
      {
        (() => {
          if (this.props.test) {
            return this.props.children;
          }
        })()
      }
    </div>)
  }
})

module.exports = XIf;
