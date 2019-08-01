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
      console.log('resovel inner', val)
      self.value = val
      self.status = RESOLVE
      self.resolveQueen.forEach(i => i(val))
    }
  }
  function reject (val) {
    if (self.status === PENDING) {
      self.error = val
      self.status = REJECT
      setTimeout(() => self.rejectQueen.forEach(i => i(val)))
      
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
  console.log( status, value, error )
  // return promise here resolveNext => resolve, rejectNext => reject
  return new BasePromise((resolvedNext, rejectedNext) => {
    // 两件事 1、推入回掉队列 2、根据status执行不同队列
    const resolveHandler = val => {
      if (typeof resolved !== 'function' ) {    // not a function, return a value
        resolvedNext(resolved)
        return
      }
      const res = resolved(val)
     
      if (res instanceof BasePromise) {
        res.then(resolvedNext, rejectedNext)
      } else {
        console.log(res, 'res')
        resolvedNext(res)
      }
    }
    const rejectHandler = err => {
      if (typeof rejected !== 'function' ) {
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
      case PENDING: {
        // console.log('peding')
        // 这里this回掉当前promise的回掉
        this.resolveQueen.push(resolveHandler)
        this.rejectQueen.push(rejectHandler)
        break
      }
      case RESOLVE: {
        
        console.log('resove', value)
        resolveHandler(value)
        break
      }
      case REJECT: {
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

const b = new BasePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 0);
})
a.then((e) => {
  console.log(e,1)
  return 1
}).then((e) => console.log(e,2))
b.then(4).then((e) => console.log(e,2))
 
