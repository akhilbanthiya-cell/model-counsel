import React, { useState, useMemo } from 'react'
import { SKILLS, CATEGORY_META, type Skill, type SkillCategory } from '../../data/skills'
import { SkillDetail } from './SkillDetail'

const ALL = 'all'
type FilterTab = SkillCategory | typeof ALL

const TABS: { id: FilterTab; label: string; count: number }[] = [
  { id: ALL, label: 'All', count: SKILLS.length },
  ...Object.entries(CATEGORY_META).map(([id, meta]) => ({
    id: id as SkillCategory,
    label: meta.label,
    count: SKILLS.filter((s) => s.category === id).length
  }))
]

function SkillCard({ skill, onClick }: { skill: Skill; onClick: () => void }) {
  const meta = CATEGORY_META[skill.category]
  return (
    <button
      onClick={onClick}
      className="bg-[#161B22] border border-[#21262D] rounded-xl p-4 text-left
                 hover:border-[#30363D] hover:bg-[#1C2333] transition-all duration-150
                 group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#E6EDF3] leading-snug group-hover:text-white">
          {skill.name}
        </h3>
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 mt-0.5"
          style={{ color: meta.color, backgroundColor: meta.bg }}
        >
          {meta.label}
        </span>
      </div>
      <p className="text-xs text-[#6E7681] leading-relaxed line-clamp-2">
        {skill.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[10px] text-[#484F58]">
          {skill.inputs.length} input{skill.inputs.length !== 1 ? 's' : ''}
        </span>
        <span className="text-[10px] text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity">
          Configure →
        </span>
      </div>
    </button>
  )
}

export function SkillsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>(ALL)
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const filtered = useMemo(() => {
    const byCategory = activeTab === ALL ? SKILLS : SKILLS.filter((s) => s.category === activeTab)
    if (!search.trim()) return byCategory
    const q = search.toLowerCase()
    return byCategory.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        CATEGORY_META[s.category].label.toLowerCase().includes(q)
    )
  }, [activeTab, search])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-4">
        <div className="flex items-start justify-between gap-6 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#E6EDF3]">Skill Browser</h1>
            <p className="text-sm text-[#8B949E] mt-1">
              Select a PM skill, fill in your context, pick models — and start the debate.
            </p>
          </div>
          {/* Search */}
          <div className="relative flex-shrink-0 w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-[#161B22] border border-[#21262D] rounded-lg pl-9 pr-3 py-2.5
                         text-sm text-[#E6EDF3] placeholder-[#484F58]
                         focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]"
              width="14" height="14" viewBox="0 0 16 16" fill="currentColor"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
            </svg>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const meta = tab.id !== ALL ? CATEGORY_META[tab.id as SkillCategory] : null
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                  'border whitespace-nowrap',
                  isActive
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/40 text-[#C4B5FD]'
                    : 'bg-[#161B22] border-[#21262D] text-[#8B949E] hover:border-[#30363D] hover:text-[#C9D1D9]'
                ].join(' ')}
                style={
                  isActive && meta
                    ? { backgroundColor: `${meta.color}18`, borderColor: `${meta.color}50`, color: meta.color }
                    : {}
                }
              >
                {tab.label}
                <span className={`ml-1.5 ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#484F58]">
            <p className="text-base font-medium text-[#6E7681]">No skills found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {filtered.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => setSelectedSkill(skill)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedSkill && (
        <SkillDetail
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  )
}
