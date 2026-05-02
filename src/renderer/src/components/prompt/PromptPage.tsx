import React, { useEffect, useRef, useState } from 'react'
import { PROVIDERS } from '../../data/providers'
import { useStore } from '../../store/useStore'

function getAvailableModels(settings: ReturnType<typeof useStore.getState>['settings']) {
  return PROVIDERS.flatMap((p) => {
    const ps = settings.providers[p.id]
    if (!ps?.apiKey?.trim()) return []
    return p.models
      .filter((m) => ps.enabledModels.includes(m.id))
      .map((m) => ({
        key: `${p.id}:${m.id}`,
        modelName: m.name,
        providerName: p.name,
        providerColor: p.color
      }))
  })
}

const MAX_CHARS = 4000

export function PromptPage() {
  const { settings, setDebateSetup, setCurrentPage } = useStore()
  const [prompt, setPrompt] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const availableModels = getAvailableModels(settings)

  useEffect(() => {
    setSelectedModels(availableModels.slice(0, 3).map((m) => m.key))
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`
  }, [prompt])

  function toggleModel(key: string) {
    setSelectedModels((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const canStart = prompt.trim().length >= 10 && selectedModels.length >= 2

  function handleStart() {
    if (!canStart) return
    const trimmed = prompt.trim()
    const title = trimmed.slice(0, 72) + (trimmed.length > 72 ? '…' : '')
    setDebateSetup({
      skillId: '__free__',
      skillName: title,
      inputs: { prompt: trimmed },
      selectedModels
    })
    setCurrentPage('debate')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-5 border-b border-[#21262D]">
        <h1 className="text-2xl font-bold text-[#E6EDF3]">Free Prompt</h1>
        <p className="text-sm text-[#8B949E] mt-1">
          Write any PM question — each model identifies and applies the relevant frameworks on its own.
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {/* Prompt textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#8B949E] uppercase tracking-widest">
              Your Prompt
            </label>
            <span className={`text-[10px] ${prompt.length > MAX_CHARS * 0.9 ? 'text-[#FBBF24]' : 'text-[#484F58]'}`}>
              {prompt.length} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
            placeholder={`e.g. "We're launching a B2B SaaS product into a crowded market. How should we think about go-to-market strategy and positioning?"`}
            rows={5}
            className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3.5
                       text-sm text-[#E6EDF3] placeholder-[#3D444D] resize-none leading-relaxed
                       focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20
                       transition-colors"
            style={{ minHeight: '140px' }}
          />
          {prompt.trim().length > 0 && prompt.trim().length < 10 && (
            <p className="text-xs text-[#6E7681] mt-1.5">Write a bit more to continue</p>
          )}
        </div>

        {/* Model selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-[#8B949E] uppercase tracking-widest">
              Models for Debate
            </label>
            <span className="text-[10px] text-[#6E7681]">
              {selectedModels.length} selected · min 2
            </span>
          </div>

          {availableModels.length === 0 ? (
            <div className="text-center py-8 bg-[#161B22] rounded-xl border border-[#21262D]">
              <p className="text-sm text-[#6E7681]">No models available</p>
              <p className="text-xs text-[#484F58] mt-1">Add API keys in Settings first</p>
              <button
                onClick={() => setCurrentPage('settings')}
                className="mt-3 text-xs text-[#8B5CF6] hover:text-[#A78BFA] underline"
              >
                Go to Settings →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {availableModels.map((model) => {
                const selected = selectedModels.includes(model.key)
                return (
                  <button
                    key={model.key}
                    onClick={() => toggleModel(model.key)}
                    className={[
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-left',
                      'border transition-colors duration-150',
                      selected
                        ? 'bg-[#1E2D4A] border-[#8B5CF6]/30 text-[#E6EDF3]'
                        : 'bg-[#161B22] border-[#21262D] text-[#6E7681] hover:border-[#30363D] hover:text-[#8B949E]'
                    ].join(' ')}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: model.providerColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate block">{model.modelName}</span>
                      <span className="text-[10px] text-[#484F58]">{model.providerName}</span>
                    </div>
                    <div
                      className={[
                        'w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                        selected ? 'bg-[#8B5CF6] text-white' : 'bg-[#21262D] text-[#484F58]'
                      ].join(' ')}
                    >
                      {selected ? '✓' : ''}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4">
          <p className="text-[10px] font-semibold text-[#484F58] uppercase tracking-wider mb-3">How it works</p>
          <div className="space-y-2.5">
            {[
              ['Round 1', 'Each model independently analyses your prompt and selects the most relevant PM frameworks.'],
              ['Round 2', 'Models read each other\'s analyses and challenge, agree, or fill gaps.'],
              ['Round 3', 'Final positions — then a synthesis report with agreement table and recommended action.']
            ].map(([label, desc], i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-[#6E7681] leading-relaxed">
                  <strong className="text-[#8B949E]">{label}</strong> — {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex-shrink-0 px-8 py-5 border-t border-[#21262D] bg-[#0D1117]">
        {prompt.trim().length >= 10 && selectedModels.length < 2 && (
          <p className="text-xs text-[#6E7681] mb-3 text-center">Select at least 2 models to continue</p>
        )}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-white text-sm font-bold rounded-lg
                     shadow-lg shadow-[#8B5CF6]/20 transition-all duration-150"
        >
          Start Debate →
        </button>
      </div>
    </div>
  )
}
