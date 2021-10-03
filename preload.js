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
    },
    data: {
        async get_nm_data() {
            return await ipcRenderer.invoke('get_nm_data').then(d => { return d })
        },
        async get_book_description(name) {
            return await ipcRenderer.invoke('get_book_description', name).then(d => {return d})
        }
    },

})
// })
console.log('preload file load success')

