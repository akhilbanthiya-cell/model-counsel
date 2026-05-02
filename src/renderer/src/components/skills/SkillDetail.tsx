import React, { useState, useEffect } from 'react'
import type { Skill } from '../../data/skills'
import { CATEGORY_META } from '../../data/skills'
import { PROVIDERS } from '../../data/providers'
import { useStore } from '../../store/useStore'

interface Props {
  skill: Skill
  onClose: () => void
}

interface AvailableModel {
  key: string // "providerId:modelId"
  modelName: string
  providerName: string
  providerColor: string
}

function getAvailableModels(settings: ReturnType<typeof useStore.getState>['settings']): AvailableModel[] {
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

export function SkillDetail({ skill, onClose }: Props) {
  const { settings, setDebateSetup, setCurrentPage } = useStore()
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  const meta = CATEGORY_META[skill.category]
  const availableModels = getAvailableModels(settings)

  // Pre-select first 3 available models when panel opens
  useEffect(() => {
    setSelectedModels(availableModels.slice(0, 3).map((m) => m.key))
    setInputs({})
  }, [skill.id])

  function handleInput(id: string, value: string) {
    setInputs((prev) => ({ ...prev, [id]: value }))
  }

  function toggleModelSelection(key: string) {
    setSelectedModels((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const requiredFilled = skill.inputs
    .filter((i) => i.required)
    .every((i) => inputs[i.id]?.trim())

  const canStart = requiredFilled && selectedModels.length >= 2

  function handleStart() {
    setDebateSetup({
      skillId: skill.id,
      skillName: skill.name,
      inputs,
      selectedModels
    })
    setCurrentPage('debate')
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="w-[460px] bg-[#0D1117] border-l border-[#21262D] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#21262D] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded mb-2 inline-block"
                style={{ color: meta.color, backgroundColor: meta.bg }}
              >
                {meta.label}
              </span>
              <h2 className="text-base font-bold text-[#E6EDF3] leading-snug">{skill.name}</h2>
              <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">{skill.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#6E7681] hover:text-[#E6EDF3] text-lg leading-none flex-shrink-0 mt-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Inputs */}
          <div className="px-6 py-5 space-y-4">
            <h3 className="text-[10px] font-semibold text-[#8B949E] uppercase tracking-widest">
              Context
            </h3>
            {skill.inputs.map((input) => (
              <div key={input.id}>
                <label className="text-xs font-medium text-[#C9D1D9] mb-1.5 block">
                  {input.label}
                  {input.required && <span className="text-[#F85149] ml-0.5">*</span>}
                </label>
                {input.type === 'textarea' ? (
                  <textarea
                    rows={input.rows ?? 3}
                    value={inputs[input.id] ?? ''}
                    onChange={(e) => handleInput(input.id, e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full bg-[#161B22] border border-[#21262D] rounded-lg px-3 py-2.5
                               text-sm text-[#E6EDF3] placeholder-[#3D444D] resize-none
                               focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20"
                  />
                ) : (
                  <input
                    type="text"
                    value={inputs[input.id] ?? ''}
                    onChange={(e) => handleInput(input.id, e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full bg-[#161B22] border border-[#21262D] rounded-lg px-3 py-2.5
                               text-sm text-[#E6EDF3] placeholder-[#3D444D]
                               focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Model selector */}
          <div className="px-6 pb-6 border-t border-[#21262D] pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-[#8B949E] uppercase tracking-widest">
                Models for Debate
              </h3>
              <span className="text-[10px] text-[#6E7681]">
                {selectedModels.length} selected · min 2
              </span>
            </div>

            {availableModels.length === 0 ? (
              <div className="text-center py-6 bg-[#161B22] rounded-xl border border-[#21262D]">
                <p className="text-sm text-[#6E7681]">No models available</p>
                <p className="text-xs text-[#484F58] mt-1">
                  Add API keys in Settings first
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {availableModels.map((model) => {
                  const selected = selectedModels.includes(model.key)
                  return (
                    <button
                      key={model.key}
                      onClick={() => toggleModelSelection(model.key)}
                      className={[
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-left',
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
                        <span className="font-medium">{model.modelName}</span>
                        <span className="text-[#484F58] ml-1.5">{model.providerName}</span>
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
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-[#21262D] flex-shrink-0 bg-[#0D1117]">
          {!requiredFilled && (
            <p className="text-xs text-[#6E7681] mb-3 text-center">
              Fill in the required fields to continue
            </p>
          )}
          {requiredFilled && selectedModels.length < 2 && (
            <p className="text-xs text-[#6E7681] mb-3 text-center">
              Select at least 2 models
            </p>
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
    </div>
  )
}
