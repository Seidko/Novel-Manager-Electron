exports.Locks = class Locks {
  #_locked
  get locked () {
    return this.#_locked
  }

  set locked (value) {
    this.#_locked = value
  }

  constructor () {
    this.locked = false
  }

  acquire (block, timeout) {}

  release () {}
}
