exports.Locks = class Locks {
  #_locked
  #_registry

  constructor () {
    this.#_locked = false
    this.#_registry = []
  }

  acquire () {
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
}
