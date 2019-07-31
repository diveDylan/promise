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
      console.log('resolve', self.resolveQueen)
      self.resolveQueen.forEach(i => i())
    }
  }
  function reject (val) {
    if (self.status === PENDING) {
      self.error = val
      self.status = REJECT
      self.rejectQueen.forEach(i => i())
    }
  }
  try {
    fn(resolve, reject)
  }catch(error) {
    reject(error)
  }
  
  return this
}

/**
 * status 控制执行时机
 * then 返回promise进行调用
 */
BasePromise.prototype.then = function(resolved, rejected) {
  const { status, value, error } = this
  // return promise here resolveNext => resolve, rejectNext => reject
  return new BasePromise((resolvedNext, rejectedNext) => {
    // 两件事 1、推入回掉队列 2、根据status执行不同队列
    // not a function, return a value
    const resolveHandler = val => {
      if (typeof resolveHandler !== 'function' ) {
        resolvedNext(val)
        return
      }
      const res = resolved(val)
      if (res instanceof BasePromise) {
        res.then(resolvedNext, rejectedNext)
      } else {
        resolvedNext(res)
      }
    }
    const rejectHandler = err => {
      if (typeof resolveHandler !== 'function' ) {
        resolvedNext(err)
        return
      }
      const res = rejected(err)
      if (res instanceof BasePromise) {
        res.then(resolvedNext, rejectedNext)
      } else {
        rejectedNext(res)
      }
    }

    // 根据状态处理
    switch (status) {
      case 'PENDING': {
        console.log('peding')
        // 这里this回掉当前promise的回掉
        this.resolveQueen.push(resolveHandler)
        this.rejectQueen.push(rejectHandler)
        break
      }
      case 'RESOLVE': {
        
        console.log('resove')
        resolveHandler(value)
        break
      }
      case 'REJECT': {
        console.log('reject')
        rejectHandler(error)
        break
      }

    }
  })
}

BasePromise.prototype.catch = function() {
  console.error(this.error)
}


const a = new BasePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 0);
})
a.then(1).then((e) => console.log(e))
 
