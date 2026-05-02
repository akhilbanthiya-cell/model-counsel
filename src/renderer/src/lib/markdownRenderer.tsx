import React from 'react'

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[#E6EDF3]">{part.slice(2, -2)}</strong>
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

function parseTable(lines: string[]): React.ReactNode {
  const rows = lines.map((l) =>
    l.split('|').map((c) => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
  )
  if (rows.length < 3) return null
  const headers = rows[0]
  const dataRows = rows.slice(2)

  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left px-3 py-2 bg-[#161B22] text-[#8B949E] font-semibold border border-[#21262D]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-[#0D1117]' : 'bg-[#0A0E14]'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-[#C9D1D9] border border-[#21262D]">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MarkdownRenderer({ content }: { content: string }): React.ReactElement {
  const lines = content.split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Table
    if (line.startsWith('|') && i + 1 < lines.length && /^\|[\s\-:|]+\|/.test(lines[i + 1])) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      nodes.push(<React.Fragment key={`t-${i}`}>{parseTable(tableLines)}</React.Fragment>)
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={i} className="text-base font-bold text-[#E6EDF3] mt-5 mb-2 first:mt-0">
          {line.slice(3)}
        </h2>
      )
      i++
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={i} className="text-sm font-semibold text-[#C9D1D9] mt-3 mb-1">
          {line.slice(4)}
        </h3>
      )
      i++
      continue
    }

    // Bullet list
    if (line.match(/^[-*] /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2))
        i++
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 pl-1">
          {items.map((item, j) => (
            <li key={j} className="text-sm text-[#C9D1D9]">{renderInline(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      nodes.push(<div key={i} className="h-1" />)
      i++
      continue
    }

    // Paragraph
    nodes.push(
      <p key={i} className="text-sm text-[#C9D1D9] leading-relaxed">
        {renderInline(line)}
      </p>
    )
    i++
  }

  return <div className="space-y-0.5">{nodes}</div>
}
