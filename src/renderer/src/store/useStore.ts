import { create } from 'zustand'
import { PROVIDERS } from '../data/providers'
import type { ApiResult } from '../types'

export type Page = 'settings' | 'skills' | 'prompt' | 'debate' | 'results'

export interface ProviderSettings {
  apiKey: string
  enabledModels: string[]
}

export interface AppSettings {
  providers: Record<string, ProviderSettings>
  debateRounds: number
}

export interface DebateSetup {
  skillId: string
  skillName: string
  inputs: Record<string, string>
  selectedModels: string[]
}

export interface DebateResult {
  id: string
  timestamp: number
  skillId: string
  skillName: string
  inputs: Record<string, string>
  selectedModels: string[]
  rounds: [Record<string, string>, Record<string, string>, Record<string, string>]
  synthesis: string
}

function defaultSettings(): AppSettings {
  return {
    providers: Object.fromEntries(
      PROVIDERS.map((p) => [
        p.id,
        { apiKey: '', enabledModels: p.models.filter((m) => m.defaultEnabled).map((m) => m.id) }
      ])
    ),
    debateRounds: 3
  }
}

interface AppStore {
  currentPage: Page
  settings: AppSettings
  isDirty: boolean
  debateSetup: DebateSetup | null
  currentResult: DebateResult | null
  history: DebateResult[]

  setCurrentPage: (page: Page) => void
  setApiKey: (providerId: string, key: string) => void
  toggleModel: (providerId: string, modelId: string) => void
  saveSettings: () => Promise<ApiResult>
  loadSettings: () => Promise<void>
  setDebateSetup: (setup: DebateSetup) => void
  clearDebateSetup: () => void
  saveResult: (result: DebateResult) => Promise<void>
  loadHistory: () => Promise<void>
  deleteHistoryItem: (id: string) => Promise<void>
  setCurrentResult: (result: DebateResult) => void
}

export const useStore = create<AppStore>((set, get) => ({
  currentPage: 'settings',
  settings: defaultSettings(),
  isDirty: false,
  debateSetup: null,
  currentResult: null,
  history: [],

  setCurrentPage: (page) => set({ currentPage: page }),

  setApiKey: (providerId, key) =>
    set((state) => ({
      isDirty: true,
      settings: {
        ...state.settings,
        providers: {
          ...state.settings.providers,
          [providerId]: { ...state.settings.providers[providerId], apiKey: key }
        }
      }
    })),

  toggleModel: (providerId, modelId) =>
    set((state) => {
      const current = state.settings.providers[providerId]?.enabledModels ?? []
      const enabledModels = current.includes(modelId)
        ? current.filter((id) => id !== modelId)
        : [...current, modelId]
      return {
        isDirty: true,
        settings: {
          ...state.settings,
          providers: {
            ...state.settings.providers,
            [providerId]: { ...state.settings.providers[providerId], enabledModels }
          }
        }
      }
    }),

  saveSettings: async () => {
    const result = await window.api.settings.save(get().settings)
    if (result.success) set({ isDirty: false })
    return result
  },

  loadSettings: async () => {
    const saved = await window.api.settings.load()
    if (saved && Object.keys(saved).length > 0) {
      set({ settings: { ...defaultSettings(), ...(saved as Partial<AppSettings>) } })
    }
  },

  setDebateSetup: (setup) => set({ debateSetup: setup }),
  clearDebateSetup: () => set({ debateSetup: null }),

  saveResult: async (result) => {
    await window.api.results.save(result)
    set((state) => ({
      currentResult: result,
      history: [result, ...state.history.filter((r) => r.id !== result.id)].slice(0, 50)
    }))
  },

  loadHistory: async () => {
    const items = await window.api.results.load()
    set({ history: items as DebateResult[] })
  },

  deleteHistoryItem: async (id) => {
    await window.api.results.delete(id)
    set((state) => ({
      history: state.history.filter((r) => r.id !== id),
      currentResult: state.currentResult?.id === id ? null : state.currentResult
    }))
  },

  setCurrentResult: (result) => set({ currentResult: result })
}))
