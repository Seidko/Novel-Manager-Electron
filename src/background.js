'use strict'
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import * as fs from 'fs/promises'
import * as path from 'path'
// import got from 'got'
import * as worker from 'worker_threads'

const isDevelopment = process.env.NODE_ENV !== 'production'

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

async function getBookContents (url, bookSource) {
  bookSource = bookSource.contents
  const temp1 = got(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
    },
    method: bookSource.method,
    encoding: bookSource.encoding
  })
  let temp2
  const temp3 = []
  switch (bookSource.content) {
    case 'text/html':
      temp2 = await temp1.text()
      temp2 = temp2.match(new RegExp(bookSource.rules.list, 'gsu'))
      for (const i in temp2) {
        temp3.push({
          url: i.match(new RegExp(bookSource.rules.url, 'su')),
          name: i.match(new RegExp(bookSource.rules.name, 'su'))
        })
      }
      break
    case 'application/json':
      temp2 = await temp1.json()
      temp3.push({
        url: temp1
      })
      break
    default :
      throw new Error('Unsupported content')
  }
  return temp3
}

const worker1 = new worker.Worker(isDevelopment ? path.join(__dirname, 'work.js') : path.join(process.resourcesPath, 'static/worker/work.js'))

worker1.postMessage('aaa')
