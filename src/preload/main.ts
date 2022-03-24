import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('novelManager', {
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
  },
  languageHandle: {
    zhHans () {
      return ipcRenderer.invoke('languageHandle.zhHans')
    }
  }
})

contextBridge.exposeInMainWorld('log', {

})

console.log('Load preload file successfully')
