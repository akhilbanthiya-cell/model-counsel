import React, { useState } from 'react'
import type { Provider } from '../../data/providers'
import { useStore } from '../../store/useStore'
import type { TestResult } from '../../types'

interface Props {
  provider: Provider
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  )
}

export function ProviderCard({ provider }: Props) {
  const { settings, setApiKey, toggleModel } = useStore()
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  const ps = settings.providers[provider.id]
  const apiKey = ps?.apiKey ?? ''
  const enabledModels = ps?.enabledModels ?? []
  const isConfigured = apiKey.trim().length > 0

  async function handleTest() {
    if (!apiKey.trim()) return
    setTesting(true)
    setTestResult(null)
    const result = await window.api.settings.testConnection(provider.id, apiKey)
    setTestResult(result)
    setTesting(false)
  }

  function handleKeyChange(e: React.ChangeEvent<HTMLInputElement>) {
    setApiKey(provider.id, e.target.value)
    setTestResult(null)
  }

  return (
    <div
      className="bg-[#161B22] rounded-xl border border-[#21262D] overflow-hidden
                 hover:border-[#30363D] transition-colors duration-200 flex flex-col"
      style={{ borderLeftWidth: '3px', borderLeftColor: provider.color }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: provider.color }}
          />
          <span className="font-semibold text-[#E6EDF3] text-sm">{provider.name}</span>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            isConfigured
              ? 'bg-[#1A3B2A] text-[#3FB950]'
              : 'bg-[#1C2128] text-[#6E7681]'
          }`}
        >
          {isConfigured ? '● Configured' : '○ Not set'}
        </span>
      </div>

      <div className="px-5 pb-5 space-y-4 flex-1 flex flex-col">
        {/* API Key Input */}
        <div>
          <label className="text-[10px] text-[#8B949E] font-semibold uppercase tracking-widest mb-1.5 block">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleKeyChange}
              placeholder={provider.keyPlaceholder}
              spellCheck={false}
              className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2.5 pr-9
                         text-sm text-[#E6EDF3] placeholder-[#3D444D] font-mono
                         focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E7681]
                         hover:text-[#8B949E] p-0.5"
            >
              <EyeIcon open={showKey} />
            </button>
          </div>
          <a
            href={provider.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] mt-1.5 inline-block"
          >
            Get API key →
          </a>
        </div>

        {/* Free tier note */}
        {provider.freeTierNote && (
          <div className="flex items-start gap-1.5 bg-[#0D3B2A] border border-[#1A5C3A] rounded-lg px-3 py-2">
            <span className="text-[#3FB950] text-xs mt-0.5 flex-shrink-0">✓</span>
            <span className="text-xs text-[#3FB950] leading-relaxed">{provider.freeTierNote}</span>
          </div>
        )}

        {/* Model Toggles */}
        <div className="flex-1">
          <label className="text-[10px] text-[#8B949E] font-semibold uppercase tracking-widest mb-1.5 block">
            Models
          </label>
          <div className="space-y-1.5">
            {provider.models.map((model) => {
              const enabled = enabledModels.includes(model.id)
              return (
                <button
                  key={model.id}
                  onClick={() => toggleModel(provider.id, model.id)}
                  className={[
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left',
                    'border transition-colors duration-150',
                    enabled
                      ? 'bg-[#1E2D4A] text-[#E6EDF3] border-[#8B5CF6]/30'
                      : 'bg-[#0D1117] text-[#6E7681] border-[#21262D] hover:border-[#30363D] hover:text-[#8B949E]'
                  ].join(' ')}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-medium truncate">{model.name}</span>
                    {model.free && (
                      <span className="text-[9px] font-bold text-[#3FB950] bg-[#0D3B2A] border border-[#1A5C3A] px-1.5 py-0.5 rounded flex-shrink-0">
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[#484F58] text-[10px]">{model.description}</span>
                    <div
                      className={[
                        'w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                        enabled ? 'bg-[#8B5CF6] text-white' : 'bg-[#21262D] text-[#484F58]'
                      ].join(' ')}
                    >
                      {enabled ? '✓' : ''}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Test Connection */}
        <div className="pt-1">
          <button
            onClick={handleTest}
            disabled={!apiKey.trim() || testing}
            className="w-full py-2 px-4 bg-[#1C2128] hover:bg-[#2D333B]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-[#C9D1D9] text-xs font-medium rounded-lg
                       border border-[#30363D] hover:border-[#484F58]
                       flex items-center justify-center gap-2"
          >
            {testing ? (
              <>
                <span className="animate-spin">⟳</span>
                Testing...
              </>
            ) : (
              '⚡ Test Connection'
            )}
          </button>
          {testResult && (
            <p
              className={`text-xs font-medium mt-2 text-center ${
                testResult.success ? 'text-[#3FB950]' : 'text-[#F85149]'
              }`}
            >
              {testResult.success
                ? `✓ Connected${testResult.latency ? ` · ${testResult.latency}ms` : ''}`
                : `✗ ${testResult.error?.slice(0, 50) ?? 'Failed'}`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
