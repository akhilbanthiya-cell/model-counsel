import React, { useEffect, useRef } from 'react'
import { PROVIDERS } from '../../data/providers'

export type ModelStatus = 'pending' | 'streaming' | 'done' | 'error'

interface Props {
  modelKey: string
  text: string
  status: ModelStatus
  error?: string
}

function getModelMeta(modelKey: string) {
  const [providerId, ...parts] = modelKey.split(':')
  const modelId = parts.join(':')
  const provider = PROVIDERS.find((p) => p.id === providerId)
  const model = provider?.models.find((m) => m.id === modelId)
  return { provider, model }
}

function StatusBadge({ status }: { status: ModelStatus }) {
  if (status === 'pending')
    return <span className="text-[10px] text-[#6E7681] bg-[#21262D] px-2 py-0.5 rounded-full">Waiting</span>
  if (status === 'streaming')
    return (
      <span className="text-[10px] text-[#FBBF24] bg-[#3B2A0A] px-2 py-0.5 rounded-full flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 bg-[#FBBF24] rounded-full animate-pulse" />
        Streaming
      </span>
    )
  if (status === 'done')
    return <span className="text-[10px] text-[#3FB950] bg-[#0D3B2A] px-2 py-0.5 rounded-full">✓ Done</span>
  return <span className="text-[10px] text-[#F85149] bg-[#3B1515] px-2 py-0.5 rounded-full">✗ Error</span>
}

export function ModelCard({ modelKey, text, status, error }: Props) {
  const { provider, model } = getModelMeta(modelKey)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (status === 'streaming') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [text, status])

  return (
    <div className="bg-[#0D1117] rounded-xl border border-[#21262D] flex flex-col min-w-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#21262D] flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: provider?.color ?? '#6E7681' }}
          />
          <span className="text-xs font-semibold text-[#E6EDF3] truncate">
            {model?.name ?? modelKey}
          </span>
          <span className="text-[10px] text-[#6E7681] flex-shrink-0">{provider?.name}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '320px', minHeight: '120px' }}>
        {status === 'pending' && (
          <div className="flex items-center gap-2 text-[#484F58] text-xs py-2">
            <span className="inline-block w-1.5 h-1.5 bg-[#484F58] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="inline-block w-1.5 h-1.5 bg-[#484F58] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="inline-block w-1.5 h-1.5 bg-[#484F58] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {(status === 'streaming' || status === 'done') && (
          <pre className="text-xs text-[#C9D1D9] whitespace-pre-wrap font-sans leading-relaxed">
            {text}
            {status === 'streaming' && (
              <span className="text-[#8B5CF6] animate-pulse">▌</span>
            )}
          </pre>
        )}

        {status === 'error' && (
          <div className="text-xs text-[#F85149] leading-relaxed">
            <p className="font-semibold mb-1">Failed to get response</p>
            <p className="text-[#8B949E]">{error || 'An unexpected error occurred'}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
