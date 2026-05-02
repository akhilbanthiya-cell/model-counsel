import React, { useState } from 'react'
import { PROVIDERS } from '../../data/providers'
import { ProviderCard } from './ProviderCard'
import { useStore } from '../../store/useStore'

export function SettingsPage() {
  const { saveSettings, isDirty } = useStore()
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaveMsg(null)
    const result = await saveSettings()
    setSaveMsg(result.success ? { ok: true, text: 'Settings saved' } : { ok: false, text: result.error ?? 'Save failed' })
    setSaving(false)
    if (result.success) setTimeout(() => setSaveMsg(null), 3000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#E6EDF3]">API Configuration</h1>
          <p className="text-sm text-[#8B949E] mt-1">
            Configure your AI provider credentials. Keys are stored locally on your device.
          </p>
        </div>

        {/* Provider grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
          {PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        {/* Debate configuration */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-[#E6EDF3] mb-3">Debate Configuration</h2>
          <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#E6EDF3]">Debate Rounds</div>
                <div className="text-xs text-[#8B949E] mt-1 space-y-0.5">
                  <div>Round 1 — Independent answers from each model</div>
                  <div>Round 2 — Rebuttal: each model responds to the others</div>
                  <div>Round 3 — Counter-rebuttal: final positions locked</div>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0 text-lg font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-5 py-3 rounded-xl border border-[#8B5CF6]/20">
                3 Rounds
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="border-t border-[#21262D] bg-[#0D1117]/95 backdrop-blur-sm px-8 py-4
                      flex items-center justify-between">
        <p className={`text-xs font-medium ${isDirty ? 'text-[#D29922]' : 'text-[#484F58]'}`}>
          {isDirty ? '● Unsaved changes' : '✓ All changes saved'}
        </p>
        <div className="flex items-center gap-4">
          {saveMsg && (
            <span className={`text-xs font-medium ${saveMsg.ok ? 'text-[#3FB950]' : 'text-[#F85149]'}`}>
              {saveMsg.ok ? '✓' : '✗'} {saveMsg.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-semibold rounded-lg shadow-sm shadow-[#8B5CF6]/20"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
