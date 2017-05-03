module.exports = function(object) {
  return Object.keys(object)
              .filter(key => { return object[key] })
              .join(" ")
}
