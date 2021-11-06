exports.Locks = class Locks {
  #blockList
  #locked

  constructor () {
    this.#blockList = []
    this.#locked = false
  }

  acquire () {
    if (!this.#locked) {
      this.#locked = true
      return Promise.resolve(undefined)
    } else {
      let _acquire
      const temp1 = new Promise((resolve) => {
        _acquire = () => {
          resolve(undefined)
        }
      })
      this.#blockList.push(_acquire)
      return temp1
    }
  }

  release () {
    this.#locked = false
    const temp1 = this.#blockList.pop()
    if (typeof temp1 !== 'undefined') {
      temp1()
    }
  }
}
