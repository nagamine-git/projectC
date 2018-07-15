'use strict'

import electron from 'electron'

const app = electron.app
const BrowserWindow = electron.BrowserWindow
// const Tray = electron.Tray
// const Menu = electron.Menu
const ipcMain = electron.ipcMain

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// Trayアイコン表示
// let tray = null
// app.on('ready', () => {
//   tray = new Tray(require('path').join(__dirname, '../renderer/assets/tray.png'))
//   const contextMenu = Menu.buildFromTemplate([
//     { label: 'Start',
//       click () {
//         mainWindow.webContents.send('start')
//       }
//     },
//     { label: 'End',
//       click () {
//         mainWindow.webContents.send('end')
//       }
//     },
//     { label: 'Quit',
//       click () {
//         app.quit()
//       }
//     }
//   ])
//   tray.setToolTip('これは自分のアプリケーションです。')
//   tray.setContextMenu(contextMenu)
// })

function createWindow () {
  /**
   * Initial window options
   */

  // ウィンドウの最大サイズを計測
  const Screen = electron.screen
  const size = Screen.getPrimaryDisplay().size

  mainWindow = new BrowserWindow({
    center: true,
    frame: false,
    height: size.height,
    resizable: false,
    transparent: true,
    useContentSize: true,
    width: size.width,
    x: 0,
    y: 0
  })

  ipcMain.on('changeView', (event, arg) => {
    let isNotch = false
    isNotch = arg === 'on'
    // 一番手前に常に表示
    mainWindow.setAlwaysOnTop(isNotch)
    // 移動できないように
    mainWindow.setMovable(!isNotch)
    // 透明な箇所がクリック可能に
    mainWindow.setIgnoreMouseEvents(isNotch)
    event.returnValue = isNotch
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
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
