const { contextBridge, ipcRenderer } = require('electron')

// window.addEventListener('DOMContentLoaded', () => {
contextBridge.exposeInMainWorld(
    'electron', {
    app: {
        quit() {
            ipcRenderer.send('close_win')
        }
    },
    win: {
        minimize() {
            ipcRenderer.send('minimize_win')
        },
        reload_html() {
            ipcRenderer.send('reload_html')
        }
    }
})
// })
console.log('preload file load success')