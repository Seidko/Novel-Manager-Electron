import { IpcRenderer } from 'electron'

declare module '@/modules/ipcRenderer' {
  const ipcRenderer: IpcRenderer
}
