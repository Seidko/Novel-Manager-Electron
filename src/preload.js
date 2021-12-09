const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  windowOperation: {
    minimize () {
      ipcRenderer.send('windowOperation.minimize')
    },
    close () {
      ipcRenderer.send('windowOperation.close')
    }
  },
  profileHandle: {
    get: {
      serializingNovel () {
        return ipcRenderer.invoke('profileHandle.get.serializingNovel')
      }
    }
  }
})

contextBridge.exposeInMainWorld('log', {

})

console.log('Load preload file successfully')
