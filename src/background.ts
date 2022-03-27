'use strict'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import * as pfs from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

// global value definition
let mainWindow: BrowserWindow
let settings: any
// end definition

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

pfs.readFile('./data/settings.json', { encoding: 'utf-8' })
  .then(value => {
    if (value === '') {
      settings = {}
      console.warn('WARN Setting file is empty!!!')
    } else {
      settings = JSON.parse(value)
    }
  })

async function createWindow () {
  mainWindow = new BrowserWindow({
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
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    await mainWindow.loadURL('app://./index.html')
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

app.on('quit', () => {
  const temp = JSON.stringify(settings, null, '  ')
  fs.writeFileSync('./data/settings.json', temp, { encoding: 'utf-8' })
})

ipcMain.on('windowOperation.minimize', () => mainWindow.minimize())
ipcMain.on('windowOperation.close', () => mainWindow.close())

ipcMain.on('languageToggle', async (ipc, lang) => {
  ipc.returnValue = await pfs.readFile(`./languages/${lang}.json`, { encoding: 'utf-8' }).then(value => JSON.parse(value))
})

ipcMain.on('profileHandle.settings.get', async (ipc) => {
  ipc.returnValue = Object.assign({}, settings, { isDevelopment: isDevelopment })
})

ipcMain.handle('profileHandle.settings.set', async (_, payload) => {
  delete payload.isDevelopment
  settings = payload
})
