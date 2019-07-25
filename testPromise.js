const promise = new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, 100);
});
console.log(promise);
