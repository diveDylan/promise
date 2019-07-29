'use strict'
const PENDING = 'pending'
const RESOLVE = 'resolve'
const REJECT = 'reject'
/**
 * 实现一个promise类可以使用一次then方法
 * @param {*} resolve 
 * @param {*} reject 
 */
function BasePromise(fn) {
  this.status = PENDING
  this.value = this.error = null
  this.resolveQueen = []
  this.rejectQueen = []
  const self = this
  function resolve (val) {
    if (self.status === PENDING) {
      self.value = val
      self.status = RESOLVE
      self.resolveQueen.forEach(i => i(self.value))
    }
  }
  function reject (val) {
    if (self.status === PENDING) {
      self.error = val
      self.status = REJECT
      self.rejectQueen.forEach(i => i(error))
    }
  }
  fn(resolve, reject)
  return this
}


BasePromise.prototype.then = function(res) {
  const self = this
  self.resolveQueen.push(res)
}

BasePromise.prototype.catch = function() {
  console.error(this.error)
}

const a = new BasePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
    console.log('111')
  }, 0);
  console.log(222)
})
a.then((e) => console.log(e))