import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useStore, type DebateResult } from '../../store/useStore'
import { SKILLS } from '../../data/skills'
import { PROVIDERS } from '../../data/providers'
import { ModelCard, type ModelStatus } from './ModelCard'
import {
  buildRound1Prompt,
  buildRound2Prompt,
  buildRound3Prompt,
  buildSynthesisPrompt,
  buildFreeRound1Prompt,
  buildFreeRound2Prompt,
  buildFreeRound3Prompt,
  buildFreeSynthesisPrompt
} from '../../lib/debatePrompts'

// ─── Types ─────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'round1' | 'round2' | 'round3' | 'synthesis' | 'done' | 'error'

interface ModelResponseState {
  text: string
  status: ModelStatus
  error?: string
}

interface RoundState {
  active: boolean
  done: boolean
  models: Record<string, ModelResponseState>
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const MAX_TOKENS = [1500, 1000, 800, 2000] // R1, R2, R3, Synthesis

function makeInitialRound(modelKeys: string[]): RoundState {
  return {
    active: false,
    done: false,
    models: Object.fromEntries(modelKeys.map((k) => [k, { text: '', status: 'pending' as ModelStatus }]))
  }
}

function getFirstSynthesisModel(modelKeys: string[], settings: ReturnType<typeof useStore.getState>['settings']): { key: string; provider: string; modelId: string; apiKey: string } | null {
  for (const key of modelKeys) {
    const [providerId, ...parts] = key.split(':')
    const apiKey = settings.providers[providerId]?.apiKey ?? ''
    if (apiKey) return { key, provider: providerId, modelId: parts.join(':'), apiKey }
  }
  return null
}

// ─── Round header component ─────────────────────────────────────────────────

const ROUND_LABELS = [
  { n: 1, name: 'Independent Analysis', desc: 'Each model analyses the prompt independently' },
  { n: 2, name: 'Rebuttal', desc: "Each model responds to the others' analyses" },
  { n: 3, name: 'Counter-Rebuttal', desc: 'Final positions — models defend or update their views' }
]

function RoundHeader({ index, active, done }: { index: number; active: boolean; done: boolean }) {
  const r = ROUND_LABELS[index]
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={[
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
          done ? 'bg-[#3FB950] text-[#0D1117]' : active ? 'bg-[#8B5CF6] text-white' : 'bg-[#21262D] text-[#6E7681]'
        ].join(' ')}
      >
        {done ? '✓' : r.n}
      </div>
      <div>
        <span className="text-sm font-semibold text-[#E6EDF3]">Round {r.n}: {r.name}</span>
        <span className="text-xs text-[#6E7681] ml-2">{r.desc}</span>
      </div>
      <div className="ml-auto flex-shrink-0">
        {active && !done && (
          <span className="text-[10px] text-[#FBBF24] bg-[#3B2A0A] px-2.5 py-1 rounded-full">
            ● Running
          </span>
        )}
        {done && (
          <span className="text-[10px] text-[#3FB950] bg-[#0D3B2A] px-2.5 py-1 rounded-full">
            Complete
          </span>
        )}
        {!active && !done && (
          <span className="text-[10px] text-[#484F58] bg-[#161B22] px-2.5 py-1 rounded-full border border-[#21262D]">
            Pending
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export function DebatePage() {
  const { debateSetup, settings, setCurrentPage, clearDebateSetup, saveResult } = useStore()
  const [phase, setPhase] = useState<Phase>('idle')
  const [rounds, setRounds] = useState<RoundState[]>([])
  const [synthesis, setSynthesis] = useState({ text: '', status: 'locked' as 'locked' | 'streaming' | 'done' | 'error' })

  // Refs to read latest response text inside async callbacks (avoids stale closure)
  const responseTexts = useRef<Array<Record<string, string>>>([{}, {}, {}])
  const synthesisRef = useRef('')
  const pendingResolvers = useRef<Map<string, { resolve: () => void; reject: (e: Error) => void }>>(new Map())

  // Set up IPC listeners once
  useEffect(() => {
    window.api.debate.onToken(({ requestId, token }) => {
      // Parse requestId: "r<round>:<modelKey>"
      const sepIdx = requestId.indexOf(':')
      const roundKey = requestId.slice(1, sepIdx) // "0", "1", "2", "s"
      const modelKey = requestId.slice(sepIdx + 1)

      if (roundKey === 's') {
        synthesisRef.current += token
        setSynthesis((prev) => ({ ...prev, text: synthesisRef.current, status: 'streaming' }))
        return
      }

      const ri = parseInt(roundKey)
      // Update ref (synchronous, for prompt building)
      responseTexts.current[ri][modelKey] = (responseTexts.current[ri][modelKey] ?? '') + token
      // Update state (for rendering)
      setRounds((prev) => {
        const next = prev.map((r, i) => {
          if (i !== ri) return r
          return {
            ...r,
            models: {
              ...r.models,
              [modelKey]: { ...r.models[modelKey], text: responseTexts.current[ri][modelKey], status: 'streaming' as ModelStatus }
            }
          }
        })
        return next
      })
    })

    window.api.debate.onStreamDone(({ requestId, success, error }) => {
      const sepIdx = requestId.indexOf(':')
      const roundKey = requestId.slice(1, sepIdx)
      const modelKey = requestId.slice(sepIdx + 1)

      if (roundKey === 's') {
        setSynthesis((prev) => ({ ...prev, status: success ? 'done' : 'error' }))
      } else {
        const ri = parseInt(roundKey)
        setRounds((prev) => prev.map((r, i) => {
          if (i !== ri) return r
          return {
            ...r,
            models: {
              ...r.models,
              [modelKey]: {
                ...r.models[modelKey],
                status: (success ? 'done' : 'error') as ModelStatus,
                error: success ? undefined : error
              }
            }
          }
        }))
      }

      const resolver = pendingResolvers.current.get(requestId)
      if (resolver) {
        pendingResolvers.current.delete(requestId)
        if (success) resolver.resolve()
        else resolver.reject(new Error(error ?? 'Unknown error'))
      }
    })

    return () => window.api.debate.removeDebateListeners()
  }, [])

  // Init rounds when debateSetup is available
  useEffect(() => {
    if (!debateSetup) return
    setRounds([
      makeInitialRound(debateSetup.selectedModels),
      makeInitialRound(debateSetup.selectedModels),
      makeInitialRound(debateSetup.selectedModels)
    ])
    responseTexts.current = [{}, {}, {}]
    synthesisRef.current = ''
    setPhase('idle')
    setSynthesis({ text: '', status: 'locked' })
  }, [debateSetup])

  // ─── Stream a single model call ─────────────────────────────────────────

  const streamModel = useCallback((roundIndex: number | 's', modelKey: string, prompt: string, maxTokens: number): Promise<void> => {
    const rKey = roundIndex === 's' ? 's' : String(roundIndex)
    const requestId = `r${rKey}:${modelKey}`
    const [providerId, ...parts] = modelKey.split(':')
    const modelId = parts.join(':')
    const apiKey = settings.providers[providerId]?.apiKey ?? ''

    // Mark as streaming
    if (roundIndex !== 's') {
      const ri = roundIndex as number
      setRounds((prev) => prev.map((r, i) =>
        i !== ri ? r : { ...r, models: { ...r.models, [modelKey]: { text: '', status: 'streaming' } } }
      ))
    }

    return new Promise((resolve, reject) => {
      pendingResolvers.current.set(requestId, { resolve, reject })
      window.api.debate.streamModel({ requestId, provider: providerId, modelId, apiKey, prompt, maxTokens })
    })
  }, [settings])

  // ─── Run a full round ────────────────────────────────────────────────────

  const runRound = useCallback(async (roundIndex: number, prompts: Record<string, string>) => {
    setRounds((prev) => prev.map((r, i) => i === roundIndex ? { ...r, active: true } : r))
    await Promise.allSettled(
      Object.entries(prompts).map(([modelKey, prompt]) =>
        streamModel(roundIndex, modelKey, prompt, MAX_TOKENS[roundIndex])
      )
    )
    setRounds((prev) => prev.map((r, i) => i === roundIndex ? { ...r, done: true } : r))
  }, [streamModel])

  // ─── Start the full debate ───────────────────────────────────────────────

  const startDebate = useCallback(async () => {
    if (!debateSetup) return
    const { skillId, inputs, selectedModels } = debateSetup
    const isFree = skillId === '__free__'
    const freePrompt = inputs.prompt ?? ''
    const skill = isFree ? null : SKILLS.find((s) => s.id === skillId)
    if (!isFree && !skill) return

    try {
      // ── Round 1 ──
      setPhase('round1')
      const r1Prompts = Object.fromEntries(
        selectedModels.map((mk) => [
          mk,
          isFree ? buildFreeRound1Prompt(freePrompt) : buildRound1Prompt(skill!, inputs)
        ])
      )
      await runRound(0, r1Prompts)

      // ── Round 2 ──
      setPhase('round2')
      const r2Prompts = Object.fromEntries(
        selectedModels.map((mk) => [
          mk,
          isFree
            ? buildFreeRound2Prompt(freePrompt, mk, responseTexts.current[0])
            : buildRound2Prompt(skill!, inputs, mk, responseTexts.current[0])
        ])
      )
      await runRound(1, r2Prompts)

      // ── Round 3 ──
      setPhase('round3')
      const r3Prompts = Object.fromEntries(
        selectedModels.map((mk) => [
          mk,
          isFree
            ? buildFreeRound3Prompt(freePrompt, mk, responseTexts.current[0], responseTexts.current[1])
            : buildRound3Prompt(skill!, inputs, mk, responseTexts.current[0], responseTexts.current[1])
        ])
      )
      await runRound(2, r3Prompts)

      // ── Synthesis ──
      setPhase('synthesis')
      setSynthesis({ text: '', status: 'streaming' })
      const synModel = getFirstSynthesisModel(selectedModels, settings)
      if (synModel) {
        const synPrompt = isFree
          ? buildFreeSynthesisPrompt(freePrompt, selectedModels, responseTexts.current[0], responseTexts.current[1], responseTexts.current[2])
          : buildSynthesisPrompt(skill!, inputs, selectedModels, responseTexts.current[0], responseTexts.current[1], responseTexts.current[2])
        await streamModel('s', synModel.key, synPrompt, MAX_TOKENS[3])
      }

      // ── Save result ──
      const result: DebateResult = {
        id: `debate-${Date.now()}`,
        timestamp: Date.now(),
        skillId: debateSetup.skillId,
        skillName: debateSetup.skillName,
        inputs: debateSetup.inputs,
        selectedModels: debateSetup.selectedModels,
        rounds: [responseTexts.current[0], responseTexts.current[1], responseTexts.current[2]],
        synthesis: synthesisRef.current
      }
      await saveResult(result)

      setPhase('done')
    } catch (err) {
      setPhase('error')
    }
  }, [debateSetup, settings, runRound, streamModel, saveResult])

  // ─── No debate setup ─────────────────────────────────────────────────────

  if (!debateSetup) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-base font-semibold text-[#8B949E]">No debate configured</p>
          <p className="text-sm text-[#484F58] mt-1 mb-5">Go to Skills, pick a skill, and click "Start Debate"</p>
          <button
            onClick={() => setCurrentPage('skills')}
            className="px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold rounded-lg"
          >
            Browse Skills →
          </button>
        </div>
      </div>
    )
  }

  const skill = SKILLS.find((s) => s.id === debateSetup.skillId)
  const modelCount = debateSetup.selectedModels.length

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-[#21262D] flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold text-[#E6EDF3]">{debateSetup.skillName}</h1>
            {phase !== 'idle' && phase !== 'done' && phase !== 'error' && (
              <span className="text-[10px] text-[#FBBF24] bg-[#3B2A0A] px-2 py-0.5 rounded-full animate-pulse">
                ● Debating
              </span>
            )}
            {phase === 'done' && (
              <span className="text-[10px] text-[#3FB950] bg-[#0D3B2A] px-2 py-0.5 rounded-full">
                ✓ Complete
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {debateSetup.selectedModels.map((mk) => {
              const [pid] = mk.split(':')
              const p = PROVIDERS.find((pr) => pr.id === pid)
              return (
                <span key={mk} className="text-[10px] text-[#8B949E] bg-[#161B22] border border-[#21262D] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p?.color ?? '#6E7681' }} />
                  {mk.split(':').slice(1).join(':')}
                </span>
              )
            })}
            <span className="text-[10px] text-[#484F58]">· 3 rounds · {modelCount} models</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {phase === 'idle' && (
            <button
              onClick={startDebate}
              className="px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-bold rounded-lg shadow-lg shadow-[#8B5CF6]/20"
            >
              ▶ Start Debate
            </button>
          )}
          {phase === 'done' && (
            <button
              onClick={() => setCurrentPage('results')}
              className="px-5 py-2 bg-[#3FB950] hover:bg-[#2EA043] text-[#0D1117] text-sm font-bold rounded-lg"
            >
              View Results →
            </button>
          )}
          <button
            onClick={() => { clearDebateSetup(); setCurrentPage('skills') }}
            className="px-4 py-2 bg-[#161B22] hover:bg-[#21262D] border border-[#21262D] hover:border-[#30363D] text-[#8B949E] hover:text-[#C9D1D9] text-sm rounded-lg"
          >
            ← New Debate
          </button>
        </div>
      </div>

      {/* Scrollable debate content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        {/* Rounds */}
        {[0, 1, 2].map((ri) => {
          const round = rounds[ri]
          if (!round) return null
          const show = round.active || round.done

          return (
            <div key={ri} className={show ? '' : 'opacity-40'}>
              <RoundHeader index={ri} active={round.active && !round.done} done={round.done} />
              {show && (
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: `repeat(${Math.min(modelCount, 3)}, minmax(0, 1fr))` }}
                >
                  {debateSetup.selectedModels.map((mk) => {
                    const ms = round.models[mk] ?? { text: '', status: 'pending' as ModelStatus }
                    return (
                      <ModelCard key={mk} modelKey={mk} text={ms.text} status={ms.status} error={ms.error} />
                    )
                  })}
                </div>
              )}
              {!show && (
                <div className="text-xs text-[#484F58] ml-10">Waiting for previous round to complete…</div>
              )}
            </div>
          )
        })}

        {/* Synthesis */}
        {(phase === 'synthesis' || phase === 'done') && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  synthesis.status === 'done' ? 'bg-[#3FB950] text-[#0D1117]' :
                  synthesis.status === 'streaming' ? 'bg-[#8B5CF6] text-white' : 'bg-[#21262D] text-[#6E7681]'
                ].join(' ')}
              >
                {synthesis.status === 'done' ? '✓' : '◎'}
              </div>
              <div>
                <span className="text-sm font-semibold text-[#E6EDF3]">Final Synthesis</span>
                <span className="text-xs text-[#6E7681] ml-2">Agreement table + consensus + recommended action</span>
              </div>
              <div className="ml-auto">
                {synthesis.status === 'streaming' && (
                  <span className="text-[10px] text-[#FBBF24] bg-[#3B2A0A] px-2.5 py-1 rounded-full">● Synthesising</span>
                )}
                {synthesis.status === 'done' && (
                  <span className="text-[10px] text-[#3FB950] bg-[#0D3B2A] px-2.5 py-1 rounded-full">Complete</span>
                )}
              </div>
            </div>

            <div className="bg-[#0D1117] rounded-xl border border-[#21262D] p-6">
              {synthesis.status === 'streaming' && !synthesis.text && (
                <div className="flex items-center gap-2 text-[#484F58] text-xs">
                  <span className="animate-spin">⟳</span> Synthesising…
                </div>
              )}
              {synthesis.text && (
                <pre className="text-sm text-[#C9D1D9] whitespace-pre-wrap font-sans leading-relaxed">
                  {synthesis.text}
                  {synthesis.status === 'streaming' && <span className="text-[#8B5CF6] animate-pulse">▌</span>}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="h-4" />
      </div>
    </div>
  )
}
