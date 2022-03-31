/* eslint-disable @typescript-eslint/no-var-requires,no-new-func */
'use strict'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs'
import path from 'path'
import booksHandle from '@/modules/booksHandle'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global value definition
let mainWindow: BrowserWindow
let settings: any
const updatingBooks: booksHandle.UpdatingBook[] = []
// end definition

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const init = (async function () {
  try {
    const raw = await fs.promises.readFile('./data/settings.json', { encoding: 'utf-8' })
    if (raw === '') {
      settings = {}
      await fs.promises.writeFile('./data/settings.json', JSON.stringify(settings, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN Settings file is empty.')
    } else {
      settings = JSON.parse(raw)
    }
  } catch (e: any) {
    if (e.errno === -4058) {
      settings = {}
      await fs.promises.writeFile('./data/settings.json', JSON.stringify(settings, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN No settings file, created one.')
    } else throw e
  }

  let temp1: any = {
    updating: []
  }

  try {
    const raw = await fs.promises.readFile('./data/books.json', { encoding: 'utf-8' })
    if (raw === '') {
      await fs.promises.writeFile('./data/books.json', JSON.stringify(temp1, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN Books file is empty.')
    } else {
      temp1 = JSON.parse(raw)
    }
  } catch (e: any) {
    if (e.errno === -4058) {
      await fs.promises.writeFile('./data/books.json', JSON.stringify(temp1, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN No books file, created one.')
    } else throw e
  }

  for (const book of temp1.updating) {
    updatingBooks.push(new booksHandle.UpdatingBook(book))
  }

  for (const book of updatingBooks) {
    console.log(await book.getBookInfo())
  }

  return true
})()

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
  ipc.returnValue = await fs.promises.readFile(`./languages/${lang}.json`, { encoding: 'utf-8' }).then(value => JSON.parse(value))
})

ipcMain.on('profileHandle.settings.get', async (ipc) => {
  await init
  ipc.returnValue = Object.assign({}, settings, { isDevelopment: isDevelopment })
})

ipcMain.handle('profileHandle.settings.set', async (_, payload) => {
  delete payload.isDevelopment
  settings = payload
})

ipcMain.handle('profileHandle.updatingBooks.getAll', async () => {
  await init
  return updatingBooks
})
