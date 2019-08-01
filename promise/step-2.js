'use strict'
const PENDING = 'pending'
const RESOLVE = 'resolve'
const REJECT = 'reject'
/**
 * 实现一个promise类可以使用多次then方法
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
    // 宏任务会在微任务执行完成后执行
    // setTimeout(() => {
      if (self.status === PENDING) {
        self.value = val
        self.status = RESOLVE
        console.log(val, self.resolveQueen)
        self.resolveQueen.forEach((a) => {
          self.value = a(self.value)
        }, self.value)
      }
    // }, 0)
    
  }
  function reject (val) {
    // 宏任务会在微任务执行完成后执行
    setTimeout(() => {
      if (self.status === PENDING) {
        self.value = val
        self.status = RESOLVE
        self.resolveQueen.forEach(i => {
          let a = i(self.value)
           constole.log(a, 'a')
        })
      }
    }, 0)
  }
  fn(resolve, reject)
  return this
}


BasePromise.prototype.then = function(resolveHandler) {
    this.resolveQueen.push(resolveHandler)
    return this
}

let a = new BasePromise((resolve,reject) => {
  setTimeout(() => {
    resolve(1)
  }, 0);
})
a.then((e) => {
  console.log(e, 1)
  return 2
}).then((e) => console.log(e, 2))