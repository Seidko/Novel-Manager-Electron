require('electron').contextBridge.exposeInMainWorld(
  'electron',
  {
    afunc () {
      return 'run a function'
    }
  }
)

console.log('Load preload file successfully')
