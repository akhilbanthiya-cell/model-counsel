import React, { useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { SettingsPage } from './components/settings/SettingsPage'
import { SkillsPage } from './components/skills/SkillsPage'
import { PromptPage } from './components/prompt/PromptPage'
import { DebatePage } from './components/debate/DebatePage'
import { ResultsPage } from './components/results/ResultsPage'
import { useStore } from './store/useStore'

export default function App() {
  const { currentPage, loadSettings } = useStore()

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <div className="flex h-screen bg-[#0D1117] text-[#E6EDF3] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'skills'   && <SkillsPage />}
        {currentPage === 'prompt'   && <PromptPage />}
        {currentPage === 'debate'   && <DebatePage />}
        {currentPage === 'results'  && <ResultsPage />}
      </main>
    </div>
  )
}
