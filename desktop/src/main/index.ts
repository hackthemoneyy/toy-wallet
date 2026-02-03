/**
 * Electron Main Process
 * Handles IPC communication and secure operations
 */

import { app, shell, BrowserWindow, ipcMain, clipboard } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Simple in-memory secure storage (in production, use keytar or similar)
const secureStorage = new Map<string, string>()

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer based on electron-vite cli
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ============================================
// IPC Handlers
// ============================================

function setupIpcHandlers(): void {
  // Secure storage handlers
  ipcMain.handle('secure-storage:get', async (_event, key: string) => {
    return secureStorage.get(key) || null
  })

  ipcMain.handle('secure-storage:set', async (_event, key: string, value: string) => {
    secureStorage.set(key, value)
  })

  ipcMain.handle('secure-storage:delete', async (_event, key: string) => {
    secureStorage.delete(key)
  })

  ipcMain.handle('secure-storage:has', async (_event, key: string) => {
    return secureStorage.has(key)
  })

  // Clipboard handlers
  ipcMain.handle('clipboard:write', async (_event, text: string) => {
    clipboard.writeText(text)
  })

  ipcMain.handle('clipboard:read', async () => {
    return clipboard.readText()
  })

  // App info handlers
  ipcMain.handle('app:version', async () => {
    return app.getVersion()
  })

  ipcMain.handle('app:platform', async () => {
    return process.platform
  })

  ipcMain.handle('app:quit', async () => {
    app.quit()
  })

  // Window handlers
  ipcMain.handle('window:minimize', async () => {
    mainWindow?.minimize()
  })

  ipcMain.handle('window:maximize', async () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.handle('window:close', async () => {
    mainWindow?.close()
  })

  ipcMain.handle('window:isMaximized', async () => {
    return mainWindow?.isMaximized() || false
  })

  // Shell handlers
  ipcMain.handle('shell:openExternal', async (_event, url: string) => {
    await shell.openExternal(url)
  })

  ipcMain.handle('shell:openPath', async (_event, path: string) => {
    return shell.openPath(path)
  })

  // Legacy ping handler
  ipcMain.on('ping', () => console.log('pong'))
}

// ============================================
// App Lifecycle
// ============================================

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.easyfi.wallet')

  // Default open or close DevTools by F12 in development
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Setup IPC handlers before creating window
  setupIpcHandlers()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Handle certificate errors for development
app.on('certificate-error', (event, _webContents, _url, _error, _certificate, callback) => {
  if (is.dev) {
    event.preventDefault()
    callback(true)
  } else {
    callback(false)
  }
})
