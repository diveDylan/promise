'use strict'

const statusTypes = {
  PENDING: 'pending',
  RESOLVE: 'resolve',
  REJECT: 'reject'
}
/**
 * 实现一个promise类可以使用一次then方法
 * @param {*} resolve 
 * @param {*} reject 
 */
function BasePromise(fn) {
  let status = statusTypes.PENDING
  this.value = this.error = null
  const self = this
  function resolve (val) {
    console.log(val)
    self.value = val
  }
  function reject (val) {
    self.error = val
  }
  fn(resolve, reject)
  return this
}


BasePromise.prototype.then = function(fn) {
  // fn(this.value)
  setTimeout(() => {
    fn(this.value)
  }, 0);
}

BasePromise.prototype.catch = function() {
  console.error(this.error)
}

const a = new BasePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 0);
})
a.then((e) => console.log(e))