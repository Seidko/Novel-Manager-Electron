const Locks = require('./src/lib/Locks/Locks')

const lock = new Locks.Locks()

const temp2 = lock.acquire()
setTimeout(async () => {
  await temp2
  console.log(2, new Date().toString())
  lock.release()
}, 3000)

setTimeout(async () => {
  await lock.acquire()
  console.log(1, new Date().toString())
  lock.release()
}, 2)
