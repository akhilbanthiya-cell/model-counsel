import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  settings: {
    load: () => ipcRenderer.invoke('settings:load'),
    save: (settings: unknown) => ipcRenderer.invoke('settings:save', settings),
    testConnection: (provider: string, apiKey: string) =>
      ipcRenderer.invoke('settings:testConnection', provider, apiKey)
  },
  debate: {
    streamModel: (params: unknown) => ipcRenderer.send('debate:streamModel', params),
    onToken: (cb: (data: { requestId: string; token: string }) => void) =>
      ipcRenderer.on('debate:token', (_e, data) => cb(data)),
    onStreamDone: (cb: (data: { requestId: string; success: boolean; error?: string }) => void) =>
      ipcRenderer.on('debate:streamDone', (_e, data) => cb(data)),
    removeDebateListeners: () => {
      ipcRenderer.removeAllListeners('debate:token')
      ipcRenderer.removeAllListeners('debate:streamDone')
    }
  },
  results: {
    save: (result: unknown) => ipcRenderer.invoke('results:save', result),
    load: () => ipcRenderer.invoke('results:load'),
    delete: (id: string) => ipcRenderer.invoke('results:delete', id)
  }
})
