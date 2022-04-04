import { ipcRenderer, contextBridge } from 'electron'
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
console.log('Load preload file successfully')
