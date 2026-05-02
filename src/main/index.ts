import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Mistral } from '@mistralai/mistralai'
import Groq from 'groq-sdk'

// ─── Settings persistence ──────────────────────────────────────────────────

function getSettingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

// ─── Results persistence ───────────────────────────────────────────────────

function getHistoryPath(): string {
  return join(app.getPath('userData'), 'debate-history.json')
}

function loadHistory(): unknown[] {
  const path = getHistoryPath()
  if (!existsSync(path)) return []
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return []
  }
}

function saveHistoryFile(items: unknown[]): void {
  writeFileSync(getHistoryPath(), JSON.stringify(items, null, 2), 'utf8')
}

function loadSettings(): Record<string, unknown> {
  const path = getSettingsPath()
  if (!existsSync(path)) return {}
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return {}
  }
}

function saveSettings(settings: Record<string, unknown>): void {
  const dir = app.getPath('userData')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2), 'utf8')
}

// ─── Test connection via raw fetch ─────────────────────────────────────────

async function testConnection(
  provider: string,
  apiKey: string
): Promise<{ success: boolean; error?: string; latency?: number }> {
  const start = Date.now()
  try {
    let response: Response
    if (provider === 'anthropic') {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1, messages: [{ role: 'user', content: 'test' }] })
      })
    } else if (provider === 'openai') {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 1, messages: [{ role: 'user', content: 'test' }] })
      })
    } else if (provider === 'google') {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'test' }] }], generationConfig: { maxOutputTokens: 1 } })
      })
    } else if (provider === 'mistral') {
      response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'mistral-small-latest', max_tokens: 1, messages: [{ role: 'user', content: 'test' }] })
      })
    } else if (provider === 'groq') {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama-3.1-8b-instant', max_tokens: 1, messages: [{ role: 'user', content: 'test' }] })
      })
    } else if (provider === 'xai') {
      response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'grok-3-mini', max_tokens: 1, messages: [{ role: 'user', content: 'test' }] })
      })
    } else {
      return { success: false, error: 'Unknown provider' }
    }
    const latency = Date.now() - start
    if (response.ok) return { success: true, latency }
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    return { success: false, error: body?.error?.message || `HTTP ${response.status}` }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

// ─── Model streaming ───────────────────────────────────────────────────────

interface StreamParams {
  requestId: string
  provider: string
  modelId: string
  apiKey: string
  prompt: string
  maxTokens: number
}

async function streamModel(webContents: Electron.WebContents, p: StreamParams): Promise<void> {
  const tok = (t: string) => {
    if (!webContents.isDestroyed()) webContents.send('debate:token', { requestId: p.requestId, token: t })
  }

  if (p.provider === 'anthropic') {
    const client = new Anthropic({ apiKey: p.apiKey })
    const stream = client.messages.stream({
      model: p.modelId,
      max_tokens: p.maxTokens,
      messages: [{ role: 'user', content: p.prompt }]
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        tok(event.delta.text)
      }
    }
    return
  }

  if (p.provider === 'openai' || p.provider === 'xai') {
    const cfg: ConstructorParameters<typeof OpenAI>[0] = { apiKey: p.apiKey }
    if (p.provider === 'xai') cfg.baseURL = 'https://api.x.ai/v1'
    const client = new OpenAI(cfg)
    const stream = await client.chat.completions.create({
      model: p.modelId,
      max_tokens: p.maxTokens,
      messages: [{ role: 'user', content: p.prompt }],
      stream: true
    })
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) tok(delta)
    }
    return
  }

  if (p.provider === 'google') {
    const genAI = new GoogleGenerativeAI(p.apiKey)
    const model = genAI.getGenerativeModel({ model: p.modelId })
    const result = await model.generateContentStream(p.prompt)
    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) tok(text)
    }
    return
  }

  if (p.provider === 'mistral') {
    const client = new Mistral({ apiKey: p.apiKey })
    const stream = client.chat.stream({
      model: p.modelId,
      messages: [{ role: 'user', content: p.prompt }],
      maxTokens: p.maxTokens
    })
    for await (const event of await stream) {
      const delta = event.data.choices[0]?.delta?.content
      if (typeof delta === 'string' && delta) tok(delta)
    }
    return
  }

  if (p.provider === 'groq') {
    const client = new Groq({ apiKey: p.apiKey })
    const stream = await client.chat.completions.create({
      model: p.modelId,
      max_tokens: p.maxTokens,
      messages: [{ role: 'user', content: p.prompt }],
      stream: true
    })
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) tok(delta)
    }
    return
  }

  throw new Error(`Unknown provider: ${p.provider}`)
}

// ─── Window ────────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#0D1117',
    title: 'Model Counsel',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => mainWindow?.show())
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ─── App lifecycle ─────────────────────────────────────────────────────────

app.whenReady().then(() => {
  ipcMain.handle('settings:load', () => loadSettings())
  ipcMain.handle('settings:save', (_, settings) => {
    try { saveSettings(settings); return { success: true } }
    catch (err: unknown) { return { success: false, error: err instanceof Error ? err.message : 'Save failed' } }
  })
  ipcMain.handle('settings:testConnection', (_, provider: string, apiKey: string) =>
    testConnection(provider, apiKey)
  )

  ipcMain.handle('results:load', () => loadHistory())
  ipcMain.handle('results:save', (_, result: unknown) => {
    try {
      const items = loadHistory()
      const r = result as { id: string }
      const updated = [result, ...items.filter((x) => (x as { id: string }).id !== r.id)].slice(0, 50)
      saveHistoryFile(updated)
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Save failed' }
    }
  })
  ipcMain.handle('results:delete', (_, id: string) => {
    try {
      saveHistoryFile(loadHistory().filter((x) => (x as { id: string }).id !== id))
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Delete failed' }
    }
  })

  // Debate streaming — one-way send, tokens come back via webContents.send
  ipcMain.on('debate:streamModel', async (event, params: StreamParams) => {
    const wc = event.sender
    try {
      await streamModel(wc, params)
      if (!wc.isDestroyed()) wc.send('debate:streamDone', { requestId: params.requestId, success: true })
    } catch (err: unknown) {
      if (!wc.isDestroyed()) wc.send('debate:streamDone', {
        requestId: params.requestId,
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      })
    }
  })

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
