'use strict'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import * as fs from 'fs/promises'
import * as path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

// global value definition
let MainWindow: BrowserWindow
// end definition

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  MainWindow = new BrowserWindow({
    width: 800,
    height: 560,
    minWidth: 890,
    minHeight: 560,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'main.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await MainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) MainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    await MainWindow.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e)
    }
  }
  await createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('windowOperation.minimize', () => MainWindow.minimize())
ipcMain.on('windowOperation.close', () => MainWindow.close())

ipcMain.handle('languageToggle', (_, lang) => {
  return fs.readFile(`./languages/${lang}.json`, { encoding: 'utf-8' }).then(value => JSON.parse(value))
})

ipcMain.handle('profileHandle.settings.get', () => {
  return fs.readFile('./data/settings.json', { encoding: 'utf-8' }).then(value => JSON.parse(value))
})
