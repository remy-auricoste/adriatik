var CommandType = Meta.createClass("CommandType", {
  name: "",
  methodName: "",
  argCount: 1,
  init: function() {
    CommandType.all.push(this);
  }
});
CommandType.all = [];
