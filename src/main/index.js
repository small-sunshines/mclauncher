'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import * as loggerWindow from './logger'
import Store from 'electron-store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#`
  : `file://${__dirname}/index.html`

const store = new Store()

if (!store.get('mc.location')) {
  let folder = process.env.APPDATA ||
    (process.platform === 'darwin'
      ? process.env.HOME + 'Library/Preferences' : '/var/local')
  store.set('mc.location', `${folder}\\mclauncher\\.minecraft\\`)
}
console.log(store.get('mc.location'))

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 630,
    minHeight: 630,
    width: 600,
    minWidth: 600,
    title: 'main',
    frame: false,
    movable: true,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('loggerOpen', (e) => {
  loggerWindow.createWindow()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
