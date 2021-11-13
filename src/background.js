'use strict'
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as http from 'http'
import { URL } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

console.log(process.env)

let bookSourceProfiles
let bookSourceObject
let serializingNovelProfiles
let serializingNovelObject
let win

(async function () {
  if (isDevelopment) {
    bookSourceProfiles = await fs.open('../data/books-source.json', 'a+')
    serializingNovelProfiles = await fs.open('../data/serializing-books.json', 'a+')
  } else {
    bookSourceProfiles = await fs.open('./data/books-source.json', 'a+')
    serializingNovelProfiles = await fs.open('./data/serializing-books.json', 'a+')
  }
  bookSourceObject = await fs.readFile(bookSourceProfiles, { encoding: 'utf-8' }).then(result => JSON.parse(result))
  serializingNovelObject = await fs.readFile(serializingNovelProfiles, { encoding: 'utf-8' }).then(result => JSON.parse(result))
  console.log(bookSourceObject, serializingNovelObject)
})()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 890,
    height: 570,
    minWidth: 890,
    minHeight: 570,
    // maxWidth: 1600,
    // maxHeight: 900,
    // autoHideMenuBar: true,
    // frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      // devTools: true,
      nativeWindowOpen: true,
      // contextIsolation: true, // 取消注释以后能够在渲染器进程中使用nodejs api
      // nodeIntegration: true,
      // sandbox: true
      preload: path.join(__dirname, 'preload.js')
    }
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  await createWindow()
})

// Exit cleanly on request from parent process in development mode.
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

function getBookContents (url, bookSource) {
  const urlParsed = new URL(url)
  return new Promise((resolve) => {
    const request = http.request({
      protocol: urlParsed.protocol,
      hostname: urlParsed.hostname,
      method: 'GET',
      path: urlParsed.pathname
    }, res => {
      res.on('error', err => console.error(err))
      res.on('data', data => {

      })
    })
    request.on('error', err => console.error(err))
  })
}
