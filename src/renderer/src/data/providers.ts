export interface Model {
  id: string
  name: string
  defaultEnabled: boolean
  description: string
  free: boolean
}

export interface Provider {
  id: string
  name: string
  color: string
  keyPlaceholder: string
  docsUrl: string
  freeTierNote?: string
  models: Model[]
}

export const PROVIDERS: Provider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    color: '#CF6679',
    keyPlaceholder: 'sk-ant-api03-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    models: [
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', defaultEnabled: true,  description: 'Cheapest',      free: false },
      { id: 'claude-sonnet-4-6',         name: 'Claude Sonnet 4.6', defaultEnabled: false, description: 'Balanced',      free: false },
      { id: 'claude-opus-4-7',           name: 'Claude Opus 4.7',   defaultEnabled: false, description: 'Most capable',  free: false }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    color: '#10A37F',
    keyPlaceholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o mini', defaultEnabled: true,  description: 'Cheapest',  free: false },
      { id: 'gpt-4o',      name: 'GPT-4o',      defaultEnabled: false, description: 'Flagship',  free: false },
      { id: 'o3-mini',     name: 'o3-mini',      defaultEnabled: false, description: 'Reasoning', free: false },
      { id: 'o1',          name: 'o1',           defaultEnabled: false, description: 'Reasoning', free: false }
    ]
  },
  {
    id: 'google',
    name: 'Google AI',
    color: '#4285F4',
    keyPlaceholder: 'AIzaSy...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    freeTierNote: 'Free tier available via Google AI Studio',
    models: [
      { id: 'gemini-2.0-flash',       name: 'Gemini 2.0 Flash',    defaultEnabled: true,  description: 'Latest · fast', free: true  },
      { id: 'gemini-2.0-flash-lite',  name: 'Gemini 2.0 Flash Lite', defaultEnabled: false, description: 'Lightweight', free: true  },
      { id: 'gemini-1.5-flash-002',   name: 'Gemini 1.5 Flash',    defaultEnabled: false, description: 'Fast',          free: true  },
      { id: 'gemini-1.5-pro-002',     name: 'Gemini 1.5 Pro',      defaultEnabled: false, description: 'High cap.',     free: false }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    color: '#FF7000',
    keyPlaceholder: '...',
    docsUrl: 'https://console.mistral.ai/api-keys',
    freeTierNote: 'Open-source models are free to use',
    models: [
      { id: 'open-mistral-7b',      name: 'Mistral 7B',      defaultEnabled: true,  description: 'Open · free',      free: true  },
      { id: 'open-mixtral-8x7b',    name: 'Mixtral 8x7B',    defaultEnabled: false, description: 'Open · free · MoE', free: true  },
      { id: 'mistral-small-latest', name: 'Mistral Small',   defaultEnabled: false, description: 'Paid',              free: false },
      { id: 'mistral-large-latest', name: 'Mistral Large',   defaultEnabled: false, description: 'Paid · capable',    free: false }
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    color: '#F55036',
    keyPlaceholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
    freeTierNote: 'All models free with rate limits — no credit card needed',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', defaultEnabled: true,  description: 'Free · versatile', free: true },
      { id: 'llama-3.1-8b-instant',    name: 'Llama 3.1 8B',  defaultEnabled: true,  description: 'Free · instant',   free: true },
      { id: 'gemma2-9b-it',            name: 'Gemma 2 9B',    defaultEnabled: false, description: 'Free · Google',    free: true },
      { id: 'mixtral-8x7b-32768',      name: 'Mixtral 8x7B',  defaultEnabled: false, description: 'Free · MoE',       free: true }
    ]
  },
  {
    id: 'xai',
    name: 'xAI',
    color: '#A8B3CF',
    keyPlaceholder: 'xai-...',
    docsUrl: 'https://console.x.ai',
    models: [
      { id: 'grok-3-mini', name: 'Grok 3 Mini', defaultEnabled: true,  description: 'Cheapest',     free: false },
      { id: 'grok-3-fast', name: 'Grok 3 Fast', defaultEnabled: false, description: 'Faster',       free: false },
      { id: 'grok-3',      name: 'Grok 3',      defaultEnabled: false, description: 'Most capable', free: false }
    ]
  }
]
