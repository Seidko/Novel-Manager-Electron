/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import * as fs from 'fs'
import * as path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global value definition
let mainWindow: BrowserWindow
let settings: any
let sources: any
let books: any
let booksDetails: any
// end definition

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

(async function () {
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

  try {
    const raw = await fs.promises.readFile('./data/sources.json', { encoding: 'utf-8' })
    if (raw === '') {
      sources = {}
      await fs.promises.writeFile('./data/sources.json', JSON.stringify(sources, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN Sources file is empty.')
    } else {
      sources = JSON.parse(raw)
    }
  } catch (e: any) {
    if (e.errno === -4058) {
      sources = {}
      await fs.promises.writeFile('./data/sources.json', JSON.stringify(sources, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN No sources file, created one.')
    } else throw e
  }

  try {
    const raw = await fs.promises.readFile('./data/books.json', { encoding: 'utf-8' })
    if (raw === '') {
      books = {
        updating: []
      }
      await fs.promises.writeFile('./data/books.json', JSON.stringify(books, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN Books file is empty.')
    } else {
      books = JSON.parse(raw)
    }
  } catch (e: any) {
    if (e.errno === -4058) {
      books = {
        updating: []
      }
      await fs.promises.writeFile('./data/books.json', JSON.stringify(books, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN No books file, created one.')
    } else throw e
  }
  for (const book of books) {
    let bookDetail = {}
    for (const source of book.sources) {
      if (source.trustLevel < 50) continue
      const temp = `./data/patterns/${source.sourceId}/bookInfo.js`
      if (!source[source.sourceId].patterns.bookInfo.function) source[source.sourceId].patterns.bookInfo.function = require(temp)
      bookDetail = source[source.sourceId].patterns.bookInfo.function(book)
    }
    if (!bookDetail) {
      // TODO: use Bubble Sort to sort the source
      for (const source of book.sources) {
        const temp = `./data/patterns/${source.sourceId}/bookInfo.js`
        // TODO: use SHA to check code safe
        if (!source[source.sourceId].patterns.bookInfo.function) source[source.sourceId].patterns.bookInfo.function = require(temp)
        bookDetail = source[source.sourceId].patterns.bookInfo.function(book)
      }
    }
  }
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
  ipc.returnValue = Object.assign({}, settings, { isDevelopment: isDevelopment })
})

ipcMain.handle('profileHandle.settings.set', async (_, payload) => {
  delete payload.isDevelopment
  settings = payload
})

// bs.getBookInfo('qula', '46443277116')
// const aa = require('../data/patterns/qula/bookInfo.js')
// aa(46443277116).then((value: any) => console.log(value))
