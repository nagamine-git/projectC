'use strict'

import electron from 'electron'

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const Menu = electron.Menu
const nativeImage = electron.nativeImage
const ipcMain = electron.ipcMain
const path = require('path')

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
let tray = null
const iconPath = path.join(path.resolve(__dirname), 'tray.png')
let trayIcon = nativeImage.createFromPath(iconPath)
let calWindow = null
trayIcon = trayIcon.resize({ width: 32, height: 32 })
app.on('ready', () => {
  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Refresh Calendar',
      click () {
        mainWindow.webContents.send('refreshCalendar')
      }
    },
    { label: 'Open Calendar',
      click () {
        const Screen = electron.screen
        const size = Screen.getPrimaryDisplay().size
        calWindow = new BrowserWindow({
          center: true,
          height: size.height,
          width: size.width
        })
        calWindow.loadURL('https://calendar.google.com/calendar/r')
        calWindow.on('closed', () => {
          calWindow = null
        })
      }
    },
    { label: 'Quit',
      click () {
        app.quit()
      }
    }
  ])
  tray.setToolTip('project_c')
  tray.setContextMenu(contextMenu)
})

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
