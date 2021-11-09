/* Lock.js
*  A utils of Synchronization Primitives
*  Included Lock, Event, Events, Condition, Barrier and BoundedSemaphore
*/

// noinspection JSUnusedGlobalSymbols
const async_hooks = require('async_hooks')

exports.Lock = class Lock {
  #_locked
  #_registry

  constructor () {
    this.#_locked = false
    this.#_registry = []
  }

  acquire () {
    // TODO: 用async_hooks.triggerAsyncId()实现RLOCK
    console.log('id: ' + async_hooks.triggerAsyncId())
    if (this.#_locked) {
      return new Promise((resolve) => {
        this.#_registry.push(() => {
          resolve(null)
          this.#_locked = true
        })
      })
    } else {
      this.#_locked = true
      return Promise.resolve(null)
    }
  }

  release () {
    this.#_locked = false
    const TEMP1 = this.#_registry.pop()
    if (typeof TEMP1 === 'function') {
      TEMP1()
    }
  }

  locked () {
    return this.#_locked
  }
}

exports.Event = class Event {
  #_event
  #_registry

  constructor () {
    this.#_event = false
    this.#_registry = []
  }

  wait () {
    if (this.#_event) {
      return Promise.resolve(null)
    } else {
      return Promise
    }
  }
}
