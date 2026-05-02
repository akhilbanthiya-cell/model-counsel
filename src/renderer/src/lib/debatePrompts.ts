import type { Skill } from '../data/skills'
import { PROVIDERS } from '../data/providers'

// ─── Free-prompt builders (no structured skill — models self-apply frameworks) ──

export function buildFreeRound1Prompt(userPrompt: string): string {
  return `You are an expert Product Manager with deep knowledge of PM frameworks, methodologies, and best practices.

The following question has been posed for structured analysis:

---

${userPrompt}

---

Provide a comprehensive response:
- Identify which PM frameworks, skills, or methodologies are most relevant to this question
- Apply those frameworks to give a structured, actionable analysis
- Be specific and concrete — no generic advice

Use clear headers and logical structure.`
}

export function buildFreeRound2Prompt(
  userPrompt: string,
  ownModelKey: string,
  round1Responses: Record<string, string>
): string {
  const others = Object.entries(round1Responses)
    .filter(([key]) => key !== ownModelKey && round1Responses[key]?.trim())
    .map(([key, text]) => `### ${modelLabel(key)}\n${text}`)
    .join('\n\n---\n\n')

  return `You are participating in a structured PM analysis debate.

## Original Question
${userPrompt}

---

## Other Participants' Round 1 Analyses

${others || '(No other responses yet)'}

---

## Your Task — Rebuttal

Review each analysis critically:

1. **Agreements** — Which specific points do you agree with and why?
2. **Disagreements** — What do you challenge? Give concrete reasoning.
3. **Gaps** — What important aspects or frameworks were overlooked?
4. **Your refined position** — How does your view evolve after seeing others' perspectives?

Be analytically rigorous. Don't hedge — take clear positions.`
}

export function buildFreeRound3Prompt(
  userPrompt: string,
  ownModelKey: string,
  round1Responses: Record<string, string>,
  round2Responses: Record<string, string>
): string {
  const ownR1 = round1Responses[ownModelKey] || '(not available)'
  const allRebuttals = Object.entries(round2Responses)
    .filter(([, text]) => text?.trim())
    .map(([key, text]) => `### ${modelLabel(key)}\n${text}`)
    .join('\n\n---\n\n')

  return `You are in the final round of a PM analysis debate on:

"${userPrompt}"

---

## Your Round 1 Analysis
${ownR1}

---

## All Round 2 Rebuttals (including yours)
${allRebuttals || '(not available)'}

---

## Your Task — Final Counter-Rebuttal

This is your definitive position. Be decisive:

1. **What changed** — Acknowledge points from the rebuttals that genuinely shifted your thinking.
2. **What stands** — Defend positions you still hold with clear reasoning.
3. **Final recommendation** — One clear, actionable conclusion synthesising everything.

No hedging. This is your final word.`
}

export function buildFreeSynthesisPrompt(
  userPrompt: string,
  modelKeys: string[],
  round1: Record<string, string>,
  round2: Record<string, string>,
  round3: Record<string, string>
): string {
  const modelNames = modelKeys.map(modelLabel)

  const transcript = modelKeys
    .map((key) => {
      const label = modelLabel(key)
      return [
        `### ${label} — Round 1\n${round1[key] || '(no response)'}`,
        `### ${label} — Round 2 (Rebuttal)\n${round2[key] || '(no response)'}`,
        `### ${label} — Round 3 (Counter-Rebuttal)\n${round3[key] || '(no response)'}`
      ].join('\n\n')
    })
    .join('\n\n═══════════════\n\n')

  return `You are the synthesis moderator for a 3-round PM analysis debate on:

"${userPrompt}"

## Participating Models
${modelNames.join(' · ')}

---

## Full Debate Transcript

${transcript}

---

## Your Task — Final Synthesis Report

Produce a structured report with these exact sections:

## Executive Summary
[2–3 sentences: what the debate concluded and the most important insight]

## Agreement Table
A markdown table. Rows = key analytical points. Columns = each model + Consensus.
Use: ✅ Agree · ❌ Disagree · ⚠️ Partial · — N/A

| Point | ${modelNames.join(' | ')} | Consensus |
|-------|${modelNames.map(() => '-------').join('|')}|-----------|

## Key Consensus Points
[Bulleted list of points all/most models agreed on]

## Main Disagreements
[Bulleted list of the sharpest debates, noting different positions]

## Recommended Next Action
[The single most important, specific action based on this analysis. Be concrete.]`
}

function formatInputs(skill: Skill, inputs: Record<string, string>): string {
  return skill.inputs
    .filter((i) => inputs[i.id]?.trim())
    .map((i) => `**${i.label}:** ${inputs[i.id].trim()}`)
    .join('\n')
}

function modelLabel(modelKey: string): string {
  const [providerId, ...parts] = modelKey.split(':')
  const modelId = parts.join(':')
  const provider = PROVIDERS.find((p) => p.id === providerId)
  const model = provider?.models.find((m) => m.id === modelId)
  return model ? `${model.name} (${provider!.name})` : modelKey
}

export function buildRound1Prompt(skill: Skill, inputs: Record<string, string>): string {
  return `You are an expert Product Manager conducting a structured analysis.

## Task: ${skill.name}

${skill.description}

## Context Provided
${formatInputs(skill, inputs)}

---

Provide a comprehensive **${skill.name}** analysis based on the context above.

Be specific, structured, and actionable. Use clear headers and bullet points where appropriate.`
}

export function buildRound2Prompt(
  skill: Skill,
  inputs: Record<string, string>,
  ownModelKey: string,
  round1Responses: Record<string, string>
): string {
  const others = Object.entries(round1Responses)
    .filter(([key]) => key !== ownModelKey && round1Responses[key]?.trim())
    .map(([key, text]) => `### ${modelLabel(key)}\n${text}`)
    .join('\n\n---\n\n')

  return `You are participating in a structured PM analysis debate.

## Topic: ${skill.name}

## Context
${formatInputs(skill, inputs)}

---

## Other Participants' Round 1 Analyses

${others || '(No other responses yet)'}

---

## Your Task — Rebuttal

Review each analysis critically:

1. **Agreements** — Which specific points do you agree with and why?
2. **Disagreements** — What do you challenge? Give concrete reasoning for each pushback.
3. **Gaps** — What important aspects were overlooked across all analyses?
4. **Your refined position** — How does your view evolve after seeing others' perspectives?

Be analytically rigorous. Don't hedge — take clear positions.`
}

export function buildRound3Prompt(
  skill: Skill,
  inputs: Record<string, string>,
  ownModelKey: string,
  round1Responses: Record<string, string>,
  round2Responses: Record<string, string>
): string {
  const ownR1 = round1Responses[ownModelKey] || '(not available)'

  const allRebuttals = Object.entries(round2Responses)
    .filter(([, text]) => text?.trim())
    .map(([key, text]) => `### ${modelLabel(key)}\n${text}`)
    .join('\n\n---\n\n')

  return `You are in the final round of a structured PM debate on: **${skill.name}**

## Context
${formatInputs(skill, inputs)}

---

## Your Round 1 Analysis
${ownR1}

---

## All Round 2 Rebuttals (including yours)
${allRebuttals || '(not available)'}

---

## Your Task — Final Counter-Rebuttal

This is your definitive position. Be decisive:

1. **What changed** — Acknowledge specific points from the rebuttals that genuinely shifted your thinking.
2. **What stands** — Defend positions you still hold and explain why the challenges didn't change your mind.
3. **Final recommendation** — One clear, actionable conclusion synthesising everything.

No hedging. This is your final word.`
}

export function buildSynthesisPrompt(
  skill: Skill,
  inputs: Record<string, string>,
  modelKeys: string[],
  round1: Record<string, string>,
  round2: Record<string, string>,
  round3: Record<string, string>
): string {
  const modelNames = modelKeys.map(modelLabel)

  const transcript = modelKeys
    .map((key) => {
      const label = modelLabel(key)
      return [
        `### ${label} — Round 1\n${round1[key] || '(no response)'}`,
        `### ${label} — Round 2 (Rebuttal)\n${round2[key] || '(no response)'}`,
        `### ${label} — Round 3 (Counter-Rebuttal)\n${round3[key] || '(no response)'}`
      ].join('\n\n')
    })
    .join('\n\n═══════════════\n\n')

  return `You are the synthesis moderator for a 3-round PM analysis debate on: **${skill.name}**

## Context
${formatInputs(skill, inputs)}

## Participating Models
${modelNames.join(' · ')}

---

## Full Debate Transcript

${transcript}

---

## Your Task — Final Synthesis Report

Produce a structured report with these exact sections:

## Executive Summary
[2–3 sentences: what the debate concluded and the most important insight]

## Agreement Table
A markdown table. Rows = key analytical points from the debate. Columns = each model + a Consensus column.
Use: ✅ Agree · ❌ Disagree · ⚠️ Partial · — N/A

| Point | ${modelNames.join(' | ')} | Consensus |
|-------|${modelNames.map(() => '-------').join('|')}|-----------|

## Key Consensus Points
[Bulleted list of points all/most models agreed on]

## Main Disagreements
[Bulleted list of the sharpest debates, noting the different positions taken]

## Recommended Next Action
[The single most important, specific action based on this analysis. Be concrete.]`
}
