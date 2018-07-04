Promise.empty = () => {
  return new Promise(resolve => {
    resolve()
  })
}
