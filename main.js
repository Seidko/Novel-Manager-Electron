"use strict";
const electron = require('electron')
const fs = require('fs')
// const path = require('path')

class WindowsEsistError extends Error {
    constructor(msg) {
        super(msg)
    }
}

function createWindow() {
    if (global.win) { throw new WindowsEsistError("Main window is esist."); };
    global.win = new electron.BrowserWindow({
        width: 800,
        height: 555,
        minWidth: 800,
        minHeight: 555,
        // maxWidth: 1600,
        // maxHeight: 900,
        autoHideMenuBar: true,
        // frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            devTools: true,
            nativeWindowOpen: true,
            // contextIsolation: false, // 取消注释以后能够在渲染器进程中使用nodejs api
            nodeIntegration: true,
            // sandbox: true
            preload: `${__dirname}\\preload.js`

        },

    });
    global.win.loadFile('nmelec.html');
}

electron.app.on('ready', () => {
    createWindow();
});

electron.app.on('window-all-closed', () => {
    console.log('app quit');
    electron.app.quit();
});

electron.ipcMain.on('close_win', () => {
    electron.app.quit();
});

electron.ipcMain.on('minimize_win', () => {
    win.minimize();
});

electron.ipcMain.on('reload_html', () => {
    win.loadFile('nmelec.html');
});


var a = "aaaaaaa"