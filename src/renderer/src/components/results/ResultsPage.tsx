import React, { useEffect, useState } from 'react'
import { useStore, type DebateResult } from '../../store/useStore'
import { PROVIDERS } from '../../data/providers'
import { MarkdownRenderer } from '../../lib/markdownRenderer'

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function ModelDot({ modelKey }: { modelKey: string }) {
  const [pid] = modelKey.split(':')
  const p = PROVIDERS.find((pr) => pr.id === pid)
  return (
    <span
      className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
      style={{ backgroundColor: p?.color ?? '#6E7681' }}
    />
  )
}

function RoundTranscript({
  roundIndex,
  models,
  responses
}: {
  roundIndex: number
  models: string[]
  responses: Record<string, string>
}) {
  const [open, setOpen] = useState(false)
  const labels = [
    'Round 1: Independent Analysis',
    'Round 2: Rebuttal',
    'Round 3: Counter-Rebuttal'
  ]
  const cols = Math.min(models.length, 3)

  return (
    <div className="border border-[#21262D] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#0D1117] hover:bg-[#161B22] transition-colors"
      >
        <span className="text-sm font-semibold text-[#C9D1D9]">{labels[roundIndex]}</span>
        <span className="text-[10px] text-[#6E7681] border border-[#21262D] px-2 py-0.5 rounded">
          {open ? '▲ Collapse' : '▼ Expand'}
        </span>
      </button>
      {open && (
        <div
          className="p-4 grid gap-3 bg-[#0A0E14]"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {models.map((mk) => {
            const [pid, ...parts] = mk.split(':')
            const provider = PROVIDERS.find((p) => p.id === pid)
            const text = responses[mk] ?? ''
            return (
              <div key={mk} className="bg-[#0D1117] rounded-lg border border-[#21262D] overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[#21262D]">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: provider?.color ?? '#6E7681' }}
                  />
                  <span className="text-xs font-semibold text-[#C9D1D9] truncate">{parts.join(':')}</span>
                </div>
                <div className="p-3 max-h-72 overflow-y-auto">
                  {text ? (
                    <pre className="text-xs text-[#8B949E] whitespace-pre-wrap font-sans leading-relaxed">
                      {text}
                    </pre>
                  ) : (
                    <span className="text-xs text-[#484F58] italic">No response</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ResultDetail({ result, onDeleted }: { result: DebateResult; onDeleted: () => void }) {
  const { deleteHistoryItem } = useStore()

  const handleExport = () => {
    const lines: string[] = [
      `# ${result.skillName} — Model Counsel Debate`,
      `Date: ${new Date(result.timestamp).toLocaleString()}`,
      `Models: ${result.selectedModels.join(', ')}`,
      '',
      '## Synthesis',
      result.synthesis,
      ''
    ]
    result.rounds.forEach((responses, i) => {
      lines.push(`## Round ${i + 1}`)
      Object.entries(responses).forEach(([mk, text]) => {
        lines.push(`### ${mk}`, text, '')
      })
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debate-${result.id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this debate from history?')) return
    await deleteHistoryItem(result.id)
    onDeleted()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#21262D] flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-[#E6EDF3] mb-1.5 truncate">{result.skillName}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#6E7681]">{formatDate(result.timestamp)}</span>
            <span className="text-[#21262D]">·</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {result.selectedModels.map((mk) => (
                <span
                  key={mk}
                  className="text-[10px] text-[#8B949E] bg-[#161B22] border border-[#21262D] px-2 py-0.5 rounded-full flex items-center gap-1"
                >
                  <ModelDot modelKey={mk} />
                  {mk.split(':').slice(1).join(':')}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-xs bg-[#161B22] border border-[#21262D] hover:border-[#8B5CF6] text-[#8B949E] hover:text-[#C9D1D9] rounded-lg transition-colors"
          >
            ↓ Export MD
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-xs bg-[#161B22] border border-[#21262D] hover:border-[#F85149] text-[#6E7681] hover:text-[#F85149] rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Synthesis card */}
        <div className="bg-[#0D1117] rounded-xl border border-[#21262D] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center text-[10px] text-white font-bold">
              ◎
            </div>
            <span className="text-sm font-bold text-[#E6EDF3]">Synthesis</span>
          </div>
          <MarkdownRenderer content={result.synthesis} />
        </div>

        {/* Round transcripts */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-[#484F58] uppercase tracking-wider">
            Round Transcripts
          </p>
          {result.rounds.map((responses, i) => (
            <RoundTranscript
              key={i}
              roundIndex={i}
              models={result.selectedModels}
              responses={responses}
            />
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}

export function ResultsPage() {
  const { history, currentResult, loadHistory, setCurrentResult } = useStore()
  const [selected, setSelected] = useState<DebateResult | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  // When arriving from DebatePage, currentResult is already set
  useEffect(() => {
    if (currentResult && !selected) {
      setSelected(currentResult)
    }
  }, [currentResult])

  // Default to most recent if nothing selected
  useEffect(() => {
    if (!selected && history.length > 0) {
      setSelected(history[0])
    }
  }, [history])

  const select = (item: DebateResult) => {
    setSelected(item)
    setCurrentResult(item)
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#484F58]">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <div className="text-base font-semibold text-[#6E7681]">No debates yet</div>
          <div className="text-sm mt-1">Complete a debate to see results here</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-[260px] flex-shrink-0 border-r border-[#21262D] flex flex-col">
        <div className="px-4 py-3 border-b border-[#21262D] flex items-center gap-2">
          <span className="text-xs font-semibold text-[#6E7681] uppercase tracking-wider">History</span>
          <span className="text-[10px] text-[#484F58] bg-[#161B22] px-1.5 py-0.5 rounded-full border border-[#21262D]">
            {history.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {history.map((item) => {
            const isActive = selected?.id === item.id
            return (
              <button
                key={item.id}
                onClick={() => select(item)}
                className={[
                  'w-full text-left px-4 py-3 border-b border-[#0D1117] transition-colors relative',
                  isActive
                    ? 'bg-[#161B22]'
                    : 'hover:bg-[#0D1117]'
                ].join(' ')}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-[#8B5CF6] rounded-full" />
                )}
                <div className="text-xs font-semibold text-[#C9D1D9] mb-1 truncate pr-1">
                  {item.skillName}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {item.selectedModels.map((mk) => (
                    <ModelDot key={mk} modelKey={mk} />
                  ))}
                </div>
                <div className="text-[10px] text-[#484F58]">{formatDate(item.timestamp)}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail pane */}
      <div className="flex-1 overflow-hidden">
        {selected ? (
          <ResultDetail
            result={selected}
            onDeleted={() => {
              const next = history.find((h) => h.id !== selected.id) ?? null
              setSelected(next)
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-[#484F58]">Select a debate from the sidebar</span>
          </div>
        )}
      </div>
    </div>
  )
}
