require('electron').contextBridge.exposeInMainWorld(
  'electron',
  {
    afunc () {
      return 'run a function'
    }
  }
)
