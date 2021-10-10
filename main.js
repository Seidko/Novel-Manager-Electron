"use strict"
const electron = require("electron")


// utils
class WindowsExistError extends Error {
  constructor(msg) {
    super(msg)
  }
}

var win = undefined

function CreateWindow() {
  if (win) { throw new WindowsExistError("Main window is esist.") }
  win = new electron.BrowserWindow({
    width: 890,
    height: 570,
    minWidth: 890,
    minHeight: 570,
    // maxWidth: 1600,
    // maxHeight: 900,
    // autoHideMenuBar: true,
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      // devTools: true,
      nativeWindowOpen: true,
      // contextIsolation: false, // 取消注释以后能够在渲染器进程中使用nodejs api
      nodeIntegration: true,
      // sandbox: true
      preload: `${__dirname}\\preload.js`

    },

  });
  win.loadFile('dist\\index.html');
}

electron.app.on('ready', () => {
  CreateWindow();
});

electron.app.on('window-all-closed', () => {
  console.log('app quit');
  electron.app.quit();
});
