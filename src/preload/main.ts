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
    settings: {
      get () {
        return ipcRenderer.invoke('profileHandle.settings.get')
      }
    }
  },
  languageToggle (lang: string) {
    return ipcRenderer.invoke('languageToggle', lang)
  }
})

contextBridge.exposeInMainWorld('log', {

})

console.log('Load preload file successfully')
