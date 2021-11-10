/* Lock.js
*  A utils of Synchronization Primitives
*  Included Lock, Event, Events, Condition, Barrier and BoundedSemaphore
*/

import { executionAsyncId } from 'async_hooks'

// noinspection JSUnusedGlobalSymbols
class Lock {
  #_locked
  #_registry
  #_registeredAsyncID

  constructor () {
    this.#_locked = false
    this.#_registry = []
    this.#_registeredAsyncID = undefined
  }

  acquire () {
    console.log(executionAsyncId())
    if (this.#_locked) {
      return new Promise((resolve) => {
        this.#_registry.push(() => {
          this.#_registeredAsyncID = executionAsyncId()
          resolve(null)
          this.#_locked = true
        })
      })
    } else {
      this.#_locked = true
      this.#_registeredAsyncID = executionAsyncId()
      return Promise.resolve(null)
    }
  }

  release () {
    console.log(executionAsyncId())
    if (this.#_registeredAsyncID === executionAsyncId()) {
      this.#_locked = false
      const TEMP1 = this.#_registry.pop()
      if (typeof TEMP1 === 'function') {
        TEMP1()
      }
    } else {
      // throw new Error('Cannot release by others async process.')
    }
  }

  locked () {
    return this.#_locked
  }
}

class RLock {
  #_lockCounter
  #_registry
  #_registeredAsyncID

  // constructor () {
  //   this.#_lockCounter = 0
  //   this.#_registry = []
  //   this.#_registeredAsyncID = undefined
  // }
  //
  // acquire () {
  //   if (this.#_lockCounter >= 1) {
  //     if (this.#_registeredAsyncID === executionAsyncId()) {
  //       this.#_lockCounter
  //       return Promise.resolve(null)
  //     } else {
  //       return
  //     }
  //   }
  // }
}

class Event {
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
      return new Promise((resolve) => {
        this.#_registry.push(() => {
          resolve(null)
        })
      })
    }
  }

  set () {
    this.#_event = true
    for (const i in this.#_registry) {
      if (typeof this.#_registry[i] === 'function') {
        this.#_registry[i]()
      }
    }
    this.#_registry = []
  }

  clear () {
    this.#_event = false
  }

  event () {
    return this.#_event
  }
}

export { Lock, Event, RLock }
export default { Lock, Event, RLock }
