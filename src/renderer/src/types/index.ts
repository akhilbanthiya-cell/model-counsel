export interface ApiResult {
  success: boolean
  error?: string
}

export interface TestResult extends ApiResult {
  latency?: number
}

export interface DebateResultRecord {
  id: string
  timestamp: number
  skillId: string
  skillName: string
  inputs: Record<string, string>
  selectedModels: string[]
  rounds: [Record<string, string>, Record<string, string>, Record<string, string>]
  synthesis: string
}

declare global {
  interface Window {
    api: {
      settings: {
        load: () => Promise<Record<string, unknown>>
        save: (settings: unknown) => Promise<ApiResult>
        testConnection: (provider: string, apiKey: string) => Promise<TestResult>
      }
      debate: {
        streamModel: (params: {
          requestId: string
          provider: string
          modelId: string
          apiKey: string
          prompt: string
          maxTokens: number
        }) => void
        onToken: (cb: (data: { requestId: string; token: string }) => void) => void
        onStreamDone: (cb: (data: { requestId: string; success: boolean; error?: string }) => void) => void
        removeDebateListeners: () => void
      }
      results: {
        save: (result: DebateResultRecord) => Promise<ApiResult>
        load: () => Promise<DebateResultRecord[]>
        delete: (id: string) => Promise<ApiResult>
      }
    }
  }
}

export {}
