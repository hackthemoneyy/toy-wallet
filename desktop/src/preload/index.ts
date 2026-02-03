/**
 * Preload Script
 * Exposes secure APIs from main process to renderer
 */

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/**
 * Wallet API exposed to renderer
 */
const walletAPI = {
  // Secure storage operations (uses keychain/credential manager)
  secureStorage: {
    get: (key: string): Promise<string | null> =>
      ipcRenderer.invoke('secure-storage:get', key),
    set: (key: string, value: string): Promise<void> =>
      ipcRenderer.invoke('secure-storage:set', key, value),
    delete: (key: string): Promise<void> =>
      ipcRenderer.invoke('secure-storage:delete', key),
    has: (key: string): Promise<boolean> =>
      ipcRenderer.invoke('secure-storage:has', key)
  },

  // Clipboard operations
  clipboard: {
    writeText: (text: string): Promise<void> =>
      ipcRenderer.invoke('clipboard:write', text),
    readText: (): Promise<string> =>
      ipcRenderer.invoke('clipboard:read')
  },

  // App info
  app: {
    getVersion: (): Promise<string> =>
      ipcRenderer.invoke('app:version'),
    getPlatform: (): Promise<string> =>
      ipcRenderer.invoke('app:platform'),
    quit: (): Promise<void> =>
      ipcRenderer.invoke('app:quit')
  },

  // Window operations
  window: {
    minimize: (): Promise<void> =>
      ipcRenderer.invoke('window:minimize'),
    maximize: (): Promise<void> =>
      ipcRenderer.invoke('window:maximize'),
    close: (): Promise<void> =>
      ipcRenderer.invoke('window:close'),
    isMaximized: (): Promise<boolean> =>
      ipcRenderer.invoke('window:isMaximized')
  },

  // Open external links
  shell: {
    openExternal: (url: string): Promise<void> =>
      ipcRenderer.invoke('shell:openExternal', url),
    openPath: (path: string): Promise<string> =>
      ipcRenderer.invoke('shell:openPath', path)
  },

  // Event listeners
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)
    return () => ipcRenderer.removeListener(channel, subscription)
  },

  // One-time event listener
  once: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.once(channel, (_event, ...args) => callback(...args))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', walletAPI)
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = walletAPI
}

// Type definitions for renderer
export type WalletAPI = typeof walletAPI
