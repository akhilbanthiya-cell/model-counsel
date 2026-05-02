export type SkillCategory =
  | 'discovery'
  | 'strategy'
  | 'execution'
  | 'market-research'
  | 'analytics'
  | 'gtm'
  | 'marketing'
  | 'toolkit'

export interface SkillInput {
  id: string
  label: string
  type: 'text' | 'textarea'
  placeholder: string
  required: boolean
  rows?: number
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  description: string
  inputs: SkillInput[]
}

export interface CategoryMeta {
  label: string
  color: string
  bg: string
}

export const CATEGORY_META: Record<SkillCategory, CategoryMeta> = {
  'discovery':       { label: 'Discovery',       color: '#60A5FA', bg: '#1E3A5F' },
  'strategy':        { label: 'Strategy',         color: '#A78BFA', bg: '#2E1B5C' },
  'execution':       { label: 'Execution',        color: '#34D399', bg: '#0D3B2A' },
  'market-research': { label: 'Market Research',  color: '#FBBF24', bg: '#3B2A0A' },
  'analytics':       { label: 'Analytics',        color: '#F87171', bg: '#3B1515' },
  'gtm':             { label: 'Go-to-Market',     color: '#F472B6', bg: '#3B1030' },
  'marketing':       { label: 'Marketing',        color: '#22D3EE', bg: '#0A2E3B' },
  'toolkit':         { label: 'Toolkit',          color: '#9CA3AF', bg: '#1F2937' },
}

export const SKILLS: Skill[] = [
  // ── Discovery ──────────────────────────────────────────────────────────────
  {
    id: 'analyze-feature-requests',
    name: 'Analyze Feature Requests',
    category: 'discovery',
    description: 'Evaluate incoming feature requests to surface patterns, opportunities, and strategic signals.',
    inputs: [
      { id: 'requests', label: 'Feature Requests', type: 'textarea', placeholder: 'Paste the feature requests you have received (one per line or as a list)...', required: true, rows: 5 },
      { id: 'context', label: 'Product Context', type: 'textarea', placeholder: 'Brief description of your product, users, and current stage...', required: true, rows: 3 },
      { id: 'criteria', label: 'Prioritization Criteria', type: 'text', placeholder: 'e.g. impact, effort, strategic alignment, revenue potential', required: false },
    ]
  },
  {
    id: 'brainstorm-experiments-existing',
    name: 'Brainstorm Experiments (Existing Product)',
    category: 'discovery',
    description: 'Generate a targeted list of experiments to test hypotheses on a live product.',
    inputs: [
      { id: 'product', label: 'Product Description', type: 'textarea', placeholder: 'What does your product do, who uses it, what is the current growth stage?', required: true, rows: 3 },
      { id: 'hypothesis', label: 'Hypothesis or Challenge', type: 'textarea', placeholder: 'What do you believe to be true? What problem are you trying to solve?', required: true, rows: 3 },
      { id: 'constraints', label: 'Constraints', type: 'text', placeholder: 'e.g. 2-week sprint, no backend changes, mobile only', required: false },
    ]
  },
  {
    id: 'brainstorm-experiments-new',
    name: 'Brainstorm Experiments (New Product)',
    category: 'discovery',
    description: 'Design lean experiments to validate the riskiest assumptions before building.',
    inputs: [
      { id: 'opportunity', label: 'Product Opportunity', type: 'textarea', placeholder: 'Describe the problem you are trying to solve and the solution idea...', required: true, rows: 3 },
      { id: 'users', label: 'Target Users', type: 'text', placeholder: 'Who are the early adopters? Describe them specifically.', required: true },
      { id: 'assumptions', label: 'Key Assumptions to Test', type: 'textarea', placeholder: 'List the biggest unknowns you need to validate...', required: false, rows: 3 },
    ]
  },
  {
    id: 'brainstorm-ideas-existing',
    name: 'Brainstorm Ideas (Existing Product)',
    category: 'discovery',
    description: 'Generate feature and improvement ideas for a live product from multiple stakeholder perspectives.',
    inputs: [
      { id: 'product', label: 'Product Context', type: 'textarea', placeholder: 'Describe your product, key metrics, and current challenges...', required: true, rows: 3 },
      { id: 'area', label: 'Focus Area', type: 'text', placeholder: 'e.g. onboarding, retention, monetization, collaboration', required: true },
      { id: 'constraints', label: 'Constraints', type: 'text', placeholder: 'e.g. team size, tech stack, timeline', required: false },
    ]
  },
  {
    id: 'brainstorm-ideas-new',
    name: 'Brainstorm Ideas (New Product)',
    category: 'discovery',
    description: 'Explore features and directions for a new product from PM, design, and engineering viewpoints.',
    inputs: [
      { id: 'concept', label: 'Product Concept', type: 'textarea', placeholder: 'Describe the product idea, the problem it solves, and why now...', required: true, rows: 3 },
      { id: 'market', label: 'Target Market', type: 'text', placeholder: 'Who is this for? Be specific about the segment.', required: true },
      { id: 'outcomes', label: 'Desired Outcomes', type: 'text', placeholder: 'What does success look like in 6–12 months?', required: false },
    ]
  },
  {
    id: 'identify-assumptions-existing',
    name: 'Identify Assumptions (Existing Product)',
    category: 'discovery',
    description: 'Surface hidden assumptions in your current product strategy before they become costly mistakes.',
    inputs: [
      { id: 'product', label: 'Product / Feature Description', type: 'textarea', placeholder: 'Describe the product or feature and how it currently works...', required: true, rows: 3 },
      { id: 'strategy', label: 'Current Strategy', type: 'textarea', placeholder: 'What is the current plan or direction you want to pressure-test?', required: true, rows: 3 },
    ]
  },
  {
    id: 'identify-assumptions-new',
    name: 'Identify Assumptions (New Product)',
    category: 'discovery',
    description: 'Map and rank the assumptions embedded in a new product concept before you commit resources.',
    inputs: [
      { id: 'concept', label: 'Product Concept', type: 'textarea', placeholder: 'Describe the product idea and how you plan to build and monetize it...', required: true, rows: 3 },
      { id: 'model', label: 'Business Model', type: 'text', placeholder: 'e.g. SaaS subscription, marketplace, freemium, one-time purchase', required: true },
    ]
  },
  {
    id: 'interview-script',
    name: 'Create Interview Script',
    category: 'discovery',
    description: 'Generate a structured user interview script to uncover deep insights from your target users.',
    inputs: [
      { id: 'goal', label: 'Research Goal', type: 'textarea', placeholder: 'What do you most need to learn from this interview?', required: true, rows: 2 },
      { id: 'persona', label: 'Target Persona', type: 'text', placeholder: 'Who will you be interviewing? Describe their role and context.', required: true },
      { id: 'areas', label: 'Topics to Explore', type: 'textarea', placeholder: 'List the key areas or questions you want to cover...', required: false, rows: 3 },
    ]
  },
  {
    id: 'metrics-dashboard',
    name: 'Design Metrics Dashboard',
    category: 'discovery',
    description: 'Define the right metrics and dashboard structure to track product health and progress.',
    inputs: [
      { id: 'product', label: 'Product Area', type: 'text', placeholder: 'e.g. mobile app onboarding, B2B checkout flow, API platform', required: true },
      { id: 'goals', label: 'Business Goals', type: 'textarea', placeholder: 'What outcomes is the team responsible for? (e.g. activation rate, MRR)', required: true, rows: 3 },
      { id: 'actions', label: 'Key User Actions', type: 'textarea', placeholder: 'What are the most important things users do in the product?', required: false, rows: 2 },
    ]
  },
  {
    id: 'opportunity-solution-tree',
    name: 'Opportunity-Solution Tree',
    category: 'discovery',
    description: 'Build a structured OST to connect product outcomes to customer opportunities and solutions.',
    inputs: [
      { id: 'outcome', label: 'Desired Product Outcome', type: 'text', placeholder: 'e.g. Increase 30-day retention by 15%', required: true },
      { id: 'problems', label: 'Known Customer Problems', type: 'textarea', placeholder: 'List the customer pain points or jobs-to-be-done you have identified...', required: true, rows: 4 },
    ]
  },
  {
    id: 'prioritize-assumptions',
    name: 'Prioritize Assumptions',
    category: 'discovery',
    description: 'Rank your assumptions by risk and importance to focus validation efforts on what matters most.',
    inputs: [
      { id: 'assumptions', label: 'Assumptions List', type: 'textarea', placeholder: 'List all the assumptions embedded in your product or strategy (one per line)...', required: true, rows: 5 },
      { id: 'criteria', label: 'Prioritization Criteria', type: 'text', placeholder: 'e.g. impact on viability, ease of testing, time sensitivity', required: false },
    ]
  },
  {
    id: 'prioritize-features',
    name: 'Prioritize Features',
    category: 'discovery',
    description: 'Apply structured frameworks to rank features by value, effort, and strategic fit.',
    inputs: [
      { id: 'features', label: 'Features to Prioritize', type: 'textarea', placeholder: 'List the features or initiatives you need to rank (one per line)...', required: true, rows: 5 },
      { id: 'goals', label: 'Strategic Goals', type: 'textarea', placeholder: 'What outcomes or OKRs are you trying to move?', required: true, rows: 2 },
      { id: 'constraints', label: 'Constraints', type: 'text', placeholder: 'e.g. team capacity, tech debt, dependencies', required: false },
    ]
  },
  {
    id: 'summarize-interview',
    name: 'Summarize User Interview',
    category: 'discovery',
    description: 'Extract key insights, quotes, and action items from a raw user interview transcript.',
    inputs: [
      { id: 'transcript', label: 'Interview Transcript or Notes', type: 'textarea', placeholder: 'Paste the interview transcript or your notes here...', required: true, rows: 8 },
      { id: 'goal', label: 'Research Goal', type: 'text', placeholder: 'What was this interview trying to discover?', required: false },
    ]
  },

  // ── Strategy ────────────────────────────────────────────────────────────────
  {
    id: 'ansoff-matrix',
    name: 'Ansoff Matrix Analysis',
    category: 'strategy',
    description: 'Evaluate four growth strategies — market penetration, development, product development, and diversification.',
    inputs: [
      { id: 'company', label: 'Company / Product', type: 'textarea', placeholder: 'Describe what you sell, who buys it, and your current market position...', required: true, rows: 3 },
      { id: 'goals', label: 'Growth Goals', type: 'textarea', placeholder: 'What are your revenue or growth targets for the next 1–3 years?', required: true, rows: 2 },
    ]
  },
  {
    id: 'business-model',
    name: 'Business Model Canvas',
    category: 'strategy',
    description: 'Map all nine building blocks of your business model to identify strengths and gaps.',
    inputs: [
      { id: 'product', label: 'Product / Service', type: 'textarea', placeholder: 'Describe what you offer and the core value it delivers...', required: true, rows: 3 },
      { id: 'customers', label: 'Target Customers', type: 'text', placeholder: 'Who are the main customer segments?', required: true },
      { id: 'revenue', label: 'Revenue Model', type: 'text', placeholder: 'How do you currently or plan to make money?', required: false },
    ]
  },
  {
    id: 'lean-canvas',
    name: 'Lean Canvas',
    category: 'strategy',
    description: 'Build a one-page business plan focused on problem, solution, and traction metrics for early-stage validation.',
    inputs: [
      { id: 'problem', label: 'Problem to Solve', type: 'textarea', placeholder: 'Top 3 problems your target customers face...', required: true, rows: 3 },
      { id: 'solution', label: 'Proposed Solution', type: 'textarea', placeholder: 'How does your product solve each problem?', required: true, rows: 3 },
      { id: 'customers', label: 'Target Customers', type: 'text', placeholder: 'Who are the early adopters?', required: true },
    ]
  },
  {
    id: 'monetization-strategy',
    name: 'Monetization Strategy',
    category: 'strategy',
    description: 'Identify and evaluate monetization approaches aligned with your product and market.',
    inputs: [
      { id: 'product', label: 'Product Description', type: 'textarea', placeholder: 'What does your product do and what value does it deliver?', required: true, rows: 3 },
      { id: 'market', label: 'Target Market', type: 'text', placeholder: 'Who are your customers? B2B, B2C, enterprise, SMB?', required: true },
      { id: 'competitors', label: 'Competitor Pricing', type: 'textarea', placeholder: 'How do competitors charge? Any known price points?', required: false, rows: 2 },
    ]
  },
  {
    id: 'pestle-analysis',
    name: 'PESTLE Analysis',
    category: 'strategy',
    description: 'Examine political, economic, social, technological, legal, and environmental forces affecting your product.',
    inputs: [
      { id: 'company', label: 'Company / Industry', type: 'text', placeholder: 'e.g. fintech startup in EU, consumer healthcare app in US', required: true },
      { id: 'context', label: 'Strategic Context', type: 'textarea', placeholder: 'What decision or strategy is this analysis informing?', required: true, rows: 3 },
    ]
  },
  {
    id: 'porters-five-forces',
    name: "Porter's Five Forces",
    category: 'strategy',
    description: "Assess competitive intensity across five dimensions to understand your industry's profit potential.",
    inputs: [
      { id: 'industry', label: 'Industry / Market', type: 'text', placeholder: 'e.g. cloud collaboration tools, last-mile logistics, SMB HR software', required: true },
      { id: 'context', label: 'Company Context', type: 'textarea', placeholder: 'Describe your product and market position...', required: true, rows: 3 },
    ]
  },
  {
    id: 'pricing-strategy',
    name: 'Pricing Strategy',
    category: 'strategy',
    description: 'Develop a pricing model and strategy calibrated to your value, market, and competitive position.',
    inputs: [
      { id: 'product', label: 'Product', type: 'textarea', placeholder: 'What does your product do and who uses it?', required: true, rows: 2 },
      { id: 'customers', label: 'Target Customers', type: 'text', placeholder: 'Who will pay? What is their budget and buying process?', required: true },
      { id: 'competitors', label: 'Competitive Landscape', type: 'textarea', placeholder: 'Key competitors and their pricing models...', required: false, rows: 2 },
    ]
  },
  {
    id: 'product-strategy',
    name: 'Product Strategy',
    category: 'strategy',
    description: 'Define a coherent product strategy connecting your vision, market opportunity, and roadmap.',
    inputs: [
      { id: 'vision', label: 'Product Vision', type: 'textarea', placeholder: 'What future are you trying to create? What does winning look like?', required: true, rows: 2 },
      { id: 'market', label: 'Market Opportunity', type: 'textarea', placeholder: 'Describe the market size, dynamics, and tailwinds...', required: true, rows: 3 },
      { id: 'competitive', label: 'Competitive Landscape', type: 'textarea', placeholder: 'Key competitors and your differentiation...', required: false, rows: 2 },
    ]
  },
  {
    id: 'product-vision',
    name: 'Product Vision Statement',
    category: 'strategy',
    description: 'Craft an inspiring, actionable product vision that aligns the team and guides long-term decisions.',
    inputs: [
      { id: 'context', label: 'Company Context', type: 'textarea', placeholder: 'What does the company do, what stage are you at, what markets do you serve?', required: true, rows: 3 },
      { id: 'users', label: 'Target Users', type: 'text', placeholder: 'Who are the primary users and what do they care about?', required: true },
      { id: 'problem', label: 'Core Problem to Solve', type: 'textarea', placeholder: 'What fundamental problem are you solving in the world?', required: true, rows: 2 },
    ]
  },
  {
    id: 'startup-canvas',
    name: 'Startup Canvas',
    category: 'strategy',
    description: 'Build a concise one-page model covering your idea, customers, traction, and unfair advantage.',
    inputs: [
      { id: 'idea', label: 'Startup Idea', type: 'textarea', placeholder: 'Describe the startup concept and the problem it solves...', required: true, rows: 3 },
      { id: 'customers', label: 'Target Customers', type: 'text', placeholder: 'Who are the early adopters and paying customers?', required: true },
      { id: 'advantage', label: 'Unfair Advantage', type: 'text', placeholder: 'What do you have that competitors cannot easily replicate?', required: false },
    ]
  },
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    category: 'strategy',
    description: 'Map internal strengths and weaknesses against external opportunities and threats.',
    inputs: [
      { id: 'subject', label: 'Company / Product / Initiative', type: 'text', placeholder: 'What are we analysing? Be specific.', required: true },
      { id: 'context', label: 'Market & Competitive Context', type: 'textarea', placeholder: 'Describe the market, key competitors, and recent trends...', required: true, rows: 3 },
    ]
  },
  {
    id: 'value-proposition',
    name: 'Value Proposition Design',
    category: 'strategy',
    description: "Map your product's value against customer jobs, pains, and gains to sharpen product-market fit.",
    inputs: [
      { id: 'product', label: 'Product', type: 'text', placeholder: 'What is the product or feature?', required: true },
      { id: 'customers', label: 'Target Customers', type: 'text', placeholder: 'Who are they? What are their key jobs-to-be-done?', required: true },
      { id: 'pains', label: 'Key Pain Points', type: 'textarea', placeholder: 'What are the biggest frustrations or obstacles customers face?', required: true, rows: 3 },
      { id: 'alternatives', label: 'Current Alternatives', type: 'text', placeholder: 'How do customers solve this problem today?', required: false },
    ]
  },

  // ── Execution ───────────────────────────────────────────────────────────────
  {
    id: 'brainstorm-okrs',
    name: 'Brainstorm OKRs',
    category: 'execution',
    description: 'Generate ambitious, measurable OKRs aligned to your team and company strategy.',
    inputs: [
      { id: 'team', label: 'Team Context', type: 'text', placeholder: 'e.g. Growth team, 8 engineers, B2B SaaS at Series B', required: true },
      { id: 'priorities', label: 'Strategic Priorities', type: 'textarea', placeholder: 'What must this team achieve in the next quarter or half?', required: true, rows: 3 },
      { id: 'period', label: 'Time Period', type: 'text', placeholder: 'e.g. Q3 2025, H2 2025', required: false },
    ]
  },
  {
    id: 'create-prd',
    name: 'Create PRD',
    category: 'execution',
    description: 'Generate a structured Product Requirements Document covering goals, scope, and success criteria.',
    inputs: [
      { id: 'feature', label: 'Feature / Epic', type: 'text', placeholder: 'Name and brief description of the feature', required: true },
      { id: 'problem', label: 'Problem Statement', type: 'textarea', placeholder: 'What user or business problem does this solve and why now?', required: true, rows: 3 },
      { id: 'users', label: 'Target Users', type: 'text', placeholder: 'Who is this for? Any specific user segments?', required: true },
      { id: 'metrics', label: 'Success Metrics', type: 'text', placeholder: 'How will we know this worked? (KPIs, OKRs)', required: false },
    ]
  },
  {
    id: 'dummy-dataset',
    name: 'Generate Dummy Dataset',
    category: 'execution',
    description: 'Create realistic sample data for demos, testing, or prototyping.',
    inputs: [
      { id: 'schema', label: 'Data Schema / Fields', type: 'textarea', placeholder: 'List the fields you need (e.g. user_id, name, email, plan, created_at, ltv)...', required: true, rows: 3 },
      { id: 'records', label: 'Number of Records', type: 'text', placeholder: 'e.g. 50 rows', required: true },
      { id: 'usecase', label: 'Use Case', type: 'text', placeholder: 'What is this data for? (e.g. sales demo, unit tests, analytics prototype)', required: false },
    ]
  },
  {
    id: 'job-stories',
    name: 'Write Job Stories',
    category: 'execution',
    description: 'Write situation-based job stories (When... I want to... So I can...) to capture user motivations.',
    inputs: [
      { id: 'context', label: 'User Context', type: 'textarea', placeholder: 'Who is the user and what situation are they in?', required: true, rows: 2 },
      { id: 'goal', label: 'User Goal', type: 'text', placeholder: "What is the user trying to accomplish?", required: true },
      { id: 'constraints', label: 'Constraints or Edge Cases', type: 'text', placeholder: 'Any important nuances to include?', required: false },
    ]
  },
  {
    id: 'outcome-roadmap',
    name: 'Create Outcome Roadmap',
    category: 'execution',
    description: 'Build an outcome-focused roadmap that communicates direction without over-committing to dates.',
    inputs: [
      { id: 'goals', label: 'Strategic Goals', type: 'textarea', placeholder: 'What outcomes must the product achieve? (link to OKRs or strategy)...', required: true, rows: 3 },
      { id: 'initiatives', label: 'Key Initiatives', type: 'textarea', placeholder: 'List the initiatives or bets you are considering...', required: true, rows: 4 },
      { id: 'horizon', label: 'Time Horizon', type: 'text', placeholder: 'e.g. Now / Next / Later, Q1–Q4 2025', required: false },
    ]
  },
  {
    id: 'pre-mortem',
    name: 'Pre-Mortem Analysis',
    category: 'execution',
    description: 'Imagine your project failed, then work backwards to identify risks before they happen.',
    inputs: [
      { id: 'project', label: 'Project / Feature Plan', type: 'textarea', placeholder: 'Describe the plan, timeline, and key milestones...', required: true, rows: 4 },
      { id: 'launch', label: 'Target Launch Date', type: 'text', placeholder: 'e.g. July 1, 2025', required: false },
      { id: 'risks', label: 'Known Risks', type: 'textarea', placeholder: 'Risks you are already aware of...', required: false, rows: 2 },
    ]
  },
  {
    id: 'prioritization-frameworks',
    name: 'Apply Prioritization Framework',
    category: 'execution',
    description: 'Run items through RICE, MoSCoW, ICE, or Kano to produce a defensible ranked list.',
    inputs: [
      { id: 'items', label: 'Items to Prioritize', type: 'textarea', placeholder: 'List the features, bugs, or initiatives to rank (one per line)...', required: true, rows: 5 },
      { id: 'goals', label: 'Goals / OKRs', type: 'textarea', placeholder: 'What outcomes are you optimizing for?', required: true, rows: 2 },
      { id: 'framework', label: 'Preferred Framework', type: 'text', placeholder: 'e.g. RICE, MoSCoW, ICE, Kano — or leave blank to recommend', required: false },
    ]
  },
  {
    id: 'release-notes',
    name: 'Write Release Notes',
    category: 'execution',
    description: 'Draft clear, user-friendly release notes for any audience from engineering to end users.',
    inputs: [
      { id: 'changes', label: 'Features / Changes Shipped', type: 'textarea', placeholder: 'List everything that shipped in this release...', required: true, rows: 5 },
      { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. developers (technical), end users (non-technical), both', required: true },
      { id: 'version', label: 'Version / Release Label', type: 'text', placeholder: 'e.g. v2.4.0, May 2025 Release', required: false },
    ]
  },
  {
    id: 'retro',
    name: 'Run Retrospective',
    category: 'execution',
    description: 'Structure a productive retrospective with clear themes and actionable takeaways.',
    inputs: [
      { id: 'context', label: 'Sprint / Project Context', type: 'textarea', placeholder: 'What did the team work on? What were the goals?', required: true, rows: 3 },
      { id: 'feedback', label: 'Team Feedback / Raw Notes', type: 'textarea', placeholder: 'Paste any raw feedback, sticky notes, or observations collected...', required: false, rows: 4 },
      { id: 'format', label: 'Retro Format', type: 'text', placeholder: 'e.g. Start / Stop / Continue, 4Ls, Mad Sad Glad — or leave blank', required: false },
    ]
  },
  {
    id: 'sprint-plan',
    name: 'Create Sprint Plan',
    category: 'execution',
    description: 'Build a focused sprint plan with a clear goal, prioritized backlog, and capacity allocation.',
    inputs: [
      { id: 'goal', label: 'Sprint Goal', type: 'text', placeholder: 'What is the single most important thing this sprint must achieve?', required: true },
      { id: 'backlog', label: 'Backlog Items', type: 'textarea', placeholder: 'List the candidate stories, bugs, or tasks...', required: true, rows: 5 },
      { id: 'capacity', label: 'Team Capacity', type: 'text', placeholder: 'e.g. 6 engineers × 10 days, minus 2 days for on-call', required: false },
    ]
  },
  {
    id: 'stakeholder-map',
    name: 'Stakeholder Map',
    category: 'execution',
    description: 'Identify, classify, and create an engagement plan for all stakeholders in a project.',
    inputs: [
      { id: 'project', label: 'Project Description', type: 'textarea', placeholder: 'What are you building or launching and why?', required: true, rows: 3 },
      { id: 'stakeholders', label: 'Known Stakeholders', type: 'textarea', placeholder: 'List the people and teams involved or affected (include titles if known)...', required: true, rows: 3 },
    ]
  },
  {
    id: 'summarize-meeting',
    name: 'Summarize Meeting',
    category: 'execution',
    description: 'Extract decisions, action items, and key discussion points from meeting notes or a transcript.',
    inputs: [
      { id: 'notes', label: 'Meeting Notes / Transcript', type: 'textarea', placeholder: 'Paste your meeting notes or transcript here...', required: true, rows: 8 },
      { id: 'type', label: 'Meeting Type', type: 'text', placeholder: 'e.g. sprint planning, product review, leadership sync', required: false },
    ]
  },
  {
    id: 'test-scenarios',
    name: 'Generate Test Scenarios',
    category: 'execution',
    description: 'Create comprehensive test scenarios covering happy paths, edge cases, and failure modes.',
    inputs: [
      { id: 'feature', label: 'Feature Description', type: 'textarea', placeholder: 'Describe the feature, how it works, and key user flows...', required: true, rows: 4 },
      { id: 'edge', label: 'Known Edge Cases', type: 'textarea', placeholder: 'Any edge cases or tricky scenarios you already know about?', required: false, rows: 2 },
    ]
  },
  {
    id: 'user-stories',
    name: 'Write User Stories',
    category: 'execution',
    description: 'Generate well-formed user stories with acceptance criteria for your engineering team.',
    inputs: [
      { id: 'epic', label: 'Feature / Epic', type: 'textarea', placeholder: 'Describe the feature or epic — what is being built and why?', required: true, rows: 3 },
      { id: 'users', label: 'Target Users', type: 'text', placeholder: 'Who will use this? List the relevant user roles.', required: true },
      { id: 'criteria', label: 'Acceptance Criteria Hints', type: 'textarea', placeholder: 'Any specific conditions or constraints for "done"?', required: false, rows: 2 },
    ]
  },
  {
    id: 'wwas',
    name: 'What Went Well / Areas to Improve',
    category: 'execution',
    description: 'Reflect on recent work to capture wins and identify specific, actionable improvements.',
    inputs: [
      { id: 'context', label: 'Work Context', type: 'textarea', placeholder: 'What project, quarter, or initiative is being reviewed?', required: true, rows: 2 },
      { id: 'events', label: 'Key Events / Observations', type: 'textarea', placeholder: 'What happened? List significant moments, decisions, or outcomes...', required: true, rows: 4 },
    ]
  },

  // ── Market Research ─────────────────────────────────────────────────────────
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    category: 'market-research',
    description: 'Systematically evaluate competitors across product, pricing, positioning, and go-to-market.',
    inputs: [
      { id: 'product', label: 'Your Product', type: 'text', placeholder: 'Brief description of what you offer', required: true },
      { id: 'competitors', label: 'Competitors', type: 'textarea', placeholder: 'List 3–6 competitors (names + brief descriptions)...', required: true, rows: 4 },
      { id: 'dimensions', label: 'Evaluation Dimensions', type: 'text', placeholder: 'e.g. pricing, features, UX, integrations, market share', required: false },
    ]
  },
  {
    id: 'customer-journey-map',
    name: 'Customer Journey Map',
    category: 'market-research',
    description: 'Map the full customer experience from awareness to advocacy to find friction and opportunities.',
    inputs: [
      { id: 'persona', label: 'Customer Persona', type: 'text', placeholder: 'Who is the customer? Describe their role, goals, and pain points.', required: true },
      { id: 'stages', label: 'Journey Stages', type: 'text', placeholder: 'e.g. Awareness → Consideration → Purchase → Onboarding → Retention', required: false },
      { id: 'product', label: 'Product / Service Context', type: 'textarea', placeholder: 'What product are we mapping and what are its main touchpoints?', required: true, rows: 2 },
    ]
  },
  {
    id: 'market-segments',
    name: 'Market Segmentation',
    category: 'market-research',
    description: 'Divide a market into meaningful segments to focus targeting and product decisions.',
    inputs: [
      { id: 'market', label: 'Total Market Description', type: 'textarea', placeholder: 'Describe the overall market you are in or entering...', required: true, rows: 3 },
      { id: 'dimensions', label: 'Segmentation Dimensions', type: 'text', placeholder: 'e.g. company size, industry vertical, behaviour, geography', required: false },
    ]
  },
  {
    id: 'market-sizing',
    name: 'Market Sizing (TAM / SAM / SOM)',
    category: 'market-research',
    description: 'Estimate TAM, SAM, and SOM using top-down and bottom-up approaches.',
    inputs: [
      { id: 'product', label: 'Product / Service', type: 'text', placeholder: 'What are you selling?', required: true },
      { id: 'geography', label: 'Target Geography', type: 'text', placeholder: 'e.g. US only, EMEA, Global', required: true },
      { id: 'pricing', label: 'Pricing Assumptions', type: 'text', placeholder: 'e.g. $50/user/month, $5k ACV', required: false },
    ]
  },
  {
    id: 'sentiment-analysis',
    name: 'Feedback Sentiment Analysis',
    category: 'market-research',
    description: 'Analyse customer feedback to surface sentiment trends, themes, and actionable signals.',
    inputs: [
      { id: 'feedback', label: 'Customer Feedback Data', type: 'textarea', placeholder: 'Paste reviews, NPS comments, support tickets, or survey responses...', required: true, rows: 8 },
      { id: 'themes', label: 'Themes to Analyse', type: 'text', placeholder: 'e.g. onboarding, pricing, performance, support — or leave blank to discover', required: false },
    ]
  },
  {
    id: 'user-personas',
    name: 'User Persona Development',
    category: 'market-research',
    description: 'Build evidence-based personas that represent your core user segments.',
    inputs: [
      { id: 'users', label: 'Target Users', type: 'textarea', placeholder: 'Describe who you are building for — roles, industries, behaviours...', required: true, rows: 3 },
      { id: 'data', label: 'Research Data / Observations', type: 'textarea', placeholder: 'Paste interview insights, survey data, or behavioural observations...', required: false, rows: 4 },
      { id: 'product', label: 'Product Context', type: 'text', placeholder: 'What does your product do?', required: true },
    ]
  },
  {
    id: 'user-segmentation',
    name: 'User Segmentation',
    category: 'market-research',
    description: 'Segment your existing user base by behaviour, lifecycle stage, or value to personalise product decisions.',
    inputs: [
      { id: 'users', label: 'User Base Description', type: 'textarea', placeholder: 'How many users, what do they do, what is the product?', required: true, rows: 3 },
      { id: 'data', label: 'Behavioural Data Available', type: 'textarea', placeholder: 'What data do you have? (e.g. usage frequency, plan type, cohort, NPS score)', required: false, rows: 2 },
      { id: 'goal', label: 'Segmentation Goal', type: 'text', placeholder: 'Why are you segmenting? (e.g. personalisation, churn reduction, upsell)', required: true },
    ]
  },

  // ── Analytics ───────────────────────────────────────────────────────────────
  {
    id: 'ab-test-analysis',
    name: 'A/B Test Analysis',
    category: 'analytics',
    description: 'Evaluate A/B test results for statistical significance, practical impact, and recommended action.',
    inputs: [
      { id: 'test', label: 'Test Description', type: 'textarea', placeholder: 'What did you test? What was the hypothesis?', required: true, rows: 3 },
      { id: 'results', label: 'Results Data', type: 'textarea', placeholder: 'Paste the key metrics: sample sizes, conversion rates, p-value, confidence intervals...', required: true, rows: 4 },
      { id: 'metric', label: 'Primary Metric', type: 'text', placeholder: 'e.g. signup conversion rate, 7-day retention, revenue per user', required: true },
    ]
  },
  {
    id: 'cohort-analysis',
    name: 'Cohort Analysis',
    category: 'analytics',
    description: 'Design or interpret a cohort analysis to understand retention, engagement, and revenue trends.',
    inputs: [
      { id: 'product', label: 'Product Context', type: 'textarea', placeholder: 'Describe your product and the user behaviour being tracked...', required: true, rows: 2 },
      { id: 'data', label: 'Cohort Data', type: 'textarea', placeholder: 'Paste retention tables, cohort curves, or raw cohort data if available...', required: false, rows: 4 },
      { id: 'goal', label: 'Analysis Goal', type: 'text', placeholder: 'e.g. identify retention drop-off, compare new vs returning users, measure LTV', required: true },
    ]
  },
  {
    id: 'sql-queries',
    name: 'Generate SQL Queries',
    category: 'analytics',
    description: 'Generate production-ready SQL queries to answer specific product and business questions.',
    inputs: [
      { id: 'schema', label: 'Data Schema', type: 'textarea', placeholder: 'Describe the tables and key columns (e.g. users.id, events.user_id, events.type, subscriptions.plan)...', required: true, rows: 4 },
      { id: 'question', label: 'Business Question', type: 'textarea', placeholder: 'What do you want to know? (e.g. "What % of users who sign up complete onboarding within 7 days?")', required: true, rows: 2 },
      { id: 'db', label: 'Database Type', type: 'text', placeholder: 'e.g. PostgreSQL, BigQuery, Snowflake, MySQL', required: false },
    ]
  },

  // ── Go-to-Market ────────────────────────────────────────────────────────────
  {
    id: 'beachhead-segment',
    name: 'Identify Beachhead Segment',
    category: 'gtm',
    description: 'Identify the single best initial market segment to own before expanding to adjacent markets.',
    inputs: [
      { id: 'product', label: 'Product Description', type: 'textarea', placeholder: 'What does your product do and what problem does it solve?', required: true, rows: 3 },
      { id: 'market', label: 'Total Addressable Market', type: 'textarea', placeholder: 'Describe the broader market and the segments within it...', required: true, rows: 3 },
    ]
  },
  {
    id: 'competitive-battlecard',
    name: 'Competitive Battlecard',
    category: 'gtm',
    description: 'Build a sales-ready battlecard with win/loss narratives and objection handling for a specific competitor.',
    inputs: [
      { id: 'product', label: 'Your Product', type: 'textarea', placeholder: 'Key strengths, differentiators, and ideal customers...', required: true, rows: 2 },
      { id: 'competitor', label: 'Competitor', type: 'text', placeholder: 'Which competitor is this battlecard for?', required: true },
      { id: 'diff', label: 'Key Differentiators', type: 'textarea', placeholder: 'Where do you win vs. them? Where do they win vs. you?', required: false, rows: 3 },
    ]
  },
  {
    id: 'growth-loops',
    name: 'Design Growth Loops',
    category: 'gtm',
    description: 'Design compounding acquisition loops that make your product grow through usage.',
    inputs: [
      { id: 'product', label: 'Product Description', type: 'textarea', placeholder: 'What does your product do? How do users currently discover and share it?', required: true, rows: 3 },
      { id: 'channels', label: 'Current Acquisition Channels', type: 'text', placeholder: 'e.g. SEO, paid ads, sales, word of mouth, integrations', required: false },
      { id: 'behaviour', label: 'Key User Behaviour', type: 'text', placeholder: 'What does the best user action look like in your product?', required: false },
    ]
  },
  {
    id: 'gtm-motions',
    name: 'Define GTM Motions',
    category: 'gtm',
    description: 'Choose and design the right go-to-market motion (PLG, SLG, or hybrid) for your product and segment.',
    inputs: [
      { id: 'product', label: 'Product Type', type: 'text', placeholder: 'e.g. developer tool, B2B SaaS, consumer app, API platform', required: true },
      { id: 'customers', label: 'Target Customers', type: 'text', placeholder: 'Who buys? Who uses? What is the typical deal size?', required: true },
      { id: 'stage', label: 'Company Stage', type: 'text', placeholder: 'e.g. pre-revenue, $1M ARR Series A, scaling to enterprise', required: false },
    ]
  },
  {
    id: 'gtm-strategy',
    name: 'Build GTM Strategy',
    category: 'gtm',
    description: 'Define a complete go-to-market strategy covering positioning, channels, pricing, and launch sequencing.',
    inputs: [
      { id: 'product', label: 'Product Description', type: 'textarea', placeholder: 'What does the product do and who is it for?', required: true, rows: 3 },
      { id: 'market', label: 'Target Market', type: 'text', placeholder: 'Primary segment and geography', required: true },
      { id: 'timeline', label: 'Launch Timeline', type: 'text', placeholder: 'e.g. launching in 3 months, currently in beta', required: false },
    ]
  },
  {
    id: 'ideal-customer-profile',
    name: 'Define Ideal Customer Profile (ICP)',
    category: 'gtm',
    description: 'Define the firmographic, technographic, and behavioural profile of your best-fit customers.',
    inputs: [
      { id: 'value', label: 'Product Value Proposition', type: 'textarea', placeholder: 'What core value does your product deliver and to whom?', required: true, rows: 2 },
      { id: 'best', label: 'Best Existing Customers', type: 'textarea', placeholder: 'Describe your 3–5 best customers — industry, size, use case, what makes them great?', required: false, rows: 3 },
      { id: 'criteria', label: 'Deal / Account Criteria', type: 'text', placeholder: 'e.g. 100+ employees, uses Salesforce, US-based, B2B SaaS company', required: false },
    ]
  },

  // ── Marketing ───────────────────────────────────────────────────────────────
  {
    id: 'marketing-ideas',
    name: 'Generate Marketing Ideas',
    category: 'marketing',
    description: 'Brainstorm creative, targeted marketing campaign ideas across channels.',
    inputs: [
      { id: 'product', label: 'Product', type: 'text', placeholder: 'What are you marketing?', required: true },
      { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Who are you trying to reach?', required: true },
      { id: 'goals', label: 'Marketing Goals', type: 'text', placeholder: 'e.g. brand awareness, lead generation, product activation', required: true },
      { id: 'budget', label: 'Budget Range', type: 'text', placeholder: 'e.g. $5k/month, bootstrapped, enterprise budget', required: false },
    ]
  },
  {
    id: 'north-star-metric',
    name: 'Define North Star Metric',
    category: 'marketing',
    description: 'Identify the single metric that best captures the value your product delivers to users.',
    inputs: [
      { id: 'product', label: 'Product Description', type: 'textarea', placeholder: 'What does your product do and how does it create value for users?', required: true, rows: 3 },
      { id: 'model', label: 'Business Model', type: 'text', placeholder: 'e.g. SaaS subscription, usage-based, marketplace, freemium', required: true },
      { id: 'action', label: 'Key User Action', type: 'text', placeholder: 'What is the core action that makes your product valuable? (e.g. messages sent, files synced)', required: false },
    ]
  },
  {
    id: 'positioning-ideas',
    name: 'Develop Positioning Ideas',
    category: 'marketing',
    description: 'Generate distinct positioning angles that differentiate your product in a crowded market.',
    inputs: [
      { id: 'product', label: 'Product', type: 'text', placeholder: 'What does your product do?', required: true },
      { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Who is the primary buyer and user?', required: true },
      { id: 'diff', label: 'Key Differentiators', type: 'textarea', placeholder: 'What makes you genuinely different from alternatives?', required: true, rows: 2 },
      { id: 'landscape', label: 'Competitive Landscape', type: 'text', placeholder: 'Who are the main alternatives users consider?', required: false },
    ]
  },
  {
    id: 'product-name',
    name: 'Generate Product Names',
    category: 'marketing',
    description: 'Brainstorm memorable, distinctive product names aligned to your brand and target audience.',
    inputs: [
      { id: 'product', label: 'Product Description', type: 'textarea', placeholder: 'What does it do? What feeling should the name evoke?', required: true, rows: 3 },
      { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Who will use this? What resonates with them?', required: true },
      { id: 'values', label: 'Brand Values', type: 'text', placeholder: 'e.g. simple, powerful, trustworthy, playful, professional', required: false },
      { id: 'constraints', label: 'Naming Constraints', type: 'text', placeholder: 'e.g. must be one word, avoid tech jargon, domain available', required: false },
    ]
  },
  {
    id: 'value-prop-statements',
    name: 'Write Value Prop Statements',
    category: 'marketing',
    description: 'Craft sharp, tested value proposition statements for different channels and audiences.',
    inputs: [
      { id: 'product', label: 'Product', type: 'text', placeholder: 'What is the product?', required: true },
      { id: 'customers', label: 'Target Customers', type: 'text', placeholder: 'Who are you writing this for?', required: true },
      { id: 'benefits', label: 'Key Benefits', type: 'textarea', placeholder: 'The 2–3 most important benefits or outcomes customers get...', required: true, rows: 2 },
      { id: 'competitors', label: 'Alternatives', type: 'text', placeholder: 'What do customers use instead today?', required: false },
    ]
  },

  // ── Toolkit ─────────────────────────────────────────────────────────────────
  {
    id: 'draft-nda',
    name: 'Draft NDA',
    category: 'toolkit',
    description: 'Generate a mutual or one-way NDA template customised to your context.',
    inputs: [
      { id: 'parties', label: 'Parties Involved', type: 'text', placeholder: 'e.g. Acme Corp (discloser) and John Smith (recipient)', required: true },
      { id: 'scope', label: 'Scope of Confidential Information', type: 'textarea', placeholder: 'What type of information is covered? (e.g. product roadmap, financials, source code)', required: true, rows: 2 },
      { id: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 2 years from signing date', required: false },
      { id: 'jurisdiction', label: 'Jurisdiction', type: 'text', placeholder: 'e.g. State of Delaware, United Kingdom', required: false },
    ]
  },
  {
    id: 'grammar-check',
    name: 'Grammar & Flow Check',
    category: 'toolkit',
    description: 'Review and improve grammar, clarity, tone, and flow of any written content.',
    inputs: [
      { id: 'text', label: 'Text to Review', type: 'textarea', placeholder: 'Paste the text you want reviewed...', required: true, rows: 8 },
      { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Who will read this? (e.g. investors, engineers, customers)', required: false },
      { id: 'tone', label: 'Desired Tone', type: 'text', placeholder: 'e.g. formal, conversational, persuasive, concise', required: false },
    ]
  },
  {
    id: 'privacy-policy',
    name: 'Generate Privacy Policy',
    category: 'toolkit',
    description: 'Create a GDPR/CCPA-aware privacy policy template tailored to your product.',
    inputs: [
      { id: 'company', label: 'Company Name', type: 'text', placeholder: 'Your company or product name', required: true },
      { id: 'data', label: 'Data Collected', type: 'textarea', placeholder: 'What personal data do you collect? (e.g. email, IP address, usage data, payment info)', required: true, rows: 3 },
      { id: 'usage', label: 'How Data Is Used', type: 'textarea', placeholder: 'Why do you collect it? Who do you share it with?', required: true, rows: 2 },
      { id: 'jurisdiction', label: 'Primary Jurisdiction', type: 'text', placeholder: 'e.g. US (CCPA), EU (GDPR), UK, Global', required: false },
    ]
  },
  {
    id: 'review-resume',
    name: 'Review PM Resume',
    category: 'toolkit',
    description: 'Get structured feedback on a Product Manager resume to improve impact and interview success.',
    inputs: [
      { id: 'resume', label: 'Resume Text', type: 'textarea', placeholder: 'Paste your resume text here...', required: true, rows: 8 },
      { id: 'role', label: 'Target Role', type: 'text', placeholder: 'e.g. Senior PM at a Series B startup, Group PM at FAANG', required: false },
      { id: 'company', label: 'Target Company Type', type: 'text', placeholder: 'e.g. early-stage startup, enterprise SaaS, consumer app', required: false },
    ]
  },
]
