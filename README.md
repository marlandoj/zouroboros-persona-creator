# Zo Persona Creator

> A reusable blueprint for creating sophisticated AI personas on [Zo Computer](https://zo.computer). Includes an 8-phase creation process, pre-built templates, automated setup scripts, and safety-first architecture — adaptable to any domain.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What This Is

This skill provides everything you need to create production-ready AI personas on Zo Computer:

- **8-Phase Creation Process** — From planning through deployment
- **Pre-built Templates** — Persona prompts, safety rules, SOUL/IDENTITY/USER/HEARTBEAT files, skill scripts, MCP wrappers
- **Automated Setup Scripts** — Generate a complete persona in 2 minutes
- **52 Reference Agents** — Built on the [Agency Agents](https://github.com/msitarzewski/agency-agents) framework for proven personality patterns
- **Domain Adaptation Guides** — Customize for financial, healthcare, legal, creative, and more
- **SkillsMP Marketplace Search** — Find community-built skills via the [SkillsMP REST API](https://skillsmp.com/docs/api)

---

## Quick Start

There are two ways to use this skill: through the **Zo chat window** (natural language) or the **terminal** (CLI scripts).

### Option 1: Natural Language via Zo Chat

The fastest way. Open your Zo chat window and type:

```
Create a new persona called "Health Coach" for the healthcare domain.
Use the zo-persona-creator skill.
```

Zo will read the skill instructions, run the setup scripts, and walk you through customization — all conversationally. You can also say things like:

- *"Set up a DevOps persona with safety rules for infrastructure access"*
- *"Create a Legal Researcher persona based on the agency-agents Legal Compliance Checker"*
- *"I want a Brand Guardian persona — use the agency-agents design division as a reference"*
- *"Validate my Health Coach persona setup"*

Zo handles file creation, persona registration, rule creation, and documentation automatically.

### Search SkillsMP First

Before building from scratch, check if a community skill already exists:

```
Search SkillsMP for skills related to "healthcare advisor"
```

Or from terminal:

```bash
cd Skills/zo-persona-creator/scripts
bun skillsmp.ts search "healthcare advisor"
bun skillsmp.ts ai-search "How to build a health coaching persona"
```

Requires a free API key from [skillsmp.com/docs/api](https://skillsmp.com/docs/api). Add it in Settings > Developers as `SKILLSMP_API_KEY`.

### Option 2: Terminal (CLI Scripts)

#### Interactive Setup (guided prompts, ~5 min)

```bash
cd Skills/zo-persona-creator/scripts
bun interactive-setup.ts
```

#### Automated Setup (one command, ~2 min)

```bash
cd Skills/zo-persona-creator/scripts
bun setup-persona.ts "Health Coach" healthcare
```

#### Validate an Existing Persona

```bash
cd Skills/zo-persona-creator/scripts
bun validate-persona.ts health-coach-skill
```

---

## Using Agency Agents as Reference Personas

This skill integrates with [**The Agency**](https://github.com/msitarzewski/agency-agents) — a collection of 52 specialized AI agent personalities across 9 divisions. Use these as starting points, reference patterns, or direct imports when building your own personas.

### Installing Agency Agents

**Via Zo chat:**

```
Clone the agency-agents repo from https://github.com/msitarzewski/agency-agents
into my workspace. Then show me the available agent categories.
```

**Via terminal:**

```bash
cd /home/workspace
git clone https://github.com/msitarzewski/agency-agents.git
ls agency-agents/
```

### Agency Agents Roster (52 agents, 9 divisions)

| Division | Agents | Examples |
|----------|--------|----------|
| **Engineering** (8) | Frontend, Backend, Mobile, AI, DevOps, Rapid Prototyper, Senior Dev, Web Dev | API design, React apps, CI/CD pipelines |
| **Design** (6) | UI Designer, UX Researcher, UX Architect, Brand Guardian, Visual Storyteller, Whimsy Injector | Design systems, brand identity, user research |
| **Marketing** (8) | Growth Hacker, Content Creator, Twitter, TikTok, Instagram, Reddit, App Store, Social Media | Multi-channel campaigns, community building |
| **Product** (3) | Sprint Prioritizer, Trend Researcher, Feedback Synthesizer | Agile planning, market research, user insights |
| **Project Management** (5) | Studio Producer, Project Shepherd, Studio Ops, Experiment Tracker, Senior PM | Cross-functional coordination, A/B testing |
| **Testing** (7) | Evidence Collector, Reality Checker, Test Analyzer, Performance Benchmarker, API Tester, Tool Evaluator, Workflow Optimizer | QA, performance testing, process improvement |
| **Support** (6) | Support Responder, Analytics Reporter, Finance Tracker, Infrastructure Maintainer, Legal Compliance, Executive Summary | Customer service, BI, compliance |
| **Spatial Computing** (6) | XR Architect, macOS Metal, XR Immersive, XR Cockpit, visionOS, Terminal Integration | AR/VR/XR development |
| **Specialized** (3) | Agents Orchestrator, Data Analytics Reporter, LSP/Index Engineer | Multi-agent coordination, code intelligence |

### How to Use Agency Agents with This Skill

**Method 1: Natural language in Zo chat**

```
Create a new persona based on the agency-agents Brand Guardian.
Adapt it for my e-commerce brand with safety rules for brand consistency.
```

**Method 2: Manual reference**

1. Browse agent files in `agency-agents/<division>/`
2. Each agent markdown file contains:
   - **Identity & Memory** — Personality traits and communication style
   - **Core Mission** — Detailed deliverables and workflows
   - **Critical Rules** — Domain-specific constraints
   - **Success Metrics** — Measurable outcomes
3. Use these as input when customizing `assets/persona-prompt-template.md`

**Method 3: Combine multiple agents**

Agency agents are composable. Create a persona that blends capabilities:

```
Create a persona that combines the agency-agents "Growth Hacker" marketing
expertise with the "Analytics Reporter" data analysis skills.
Name it "Growth Analyst" and add safety rules for data privacy.
```

---

## Searching SkillsMP

[SkillsMP](https://skillsmp.com) is a community marketplace of AI skills. This skill includes a client script that lets you search it during planning or anytime you need inspiration.

### Setup

1. Get a free API key at [skillsmp.com/docs/api](https://skillsmp.com/docs/api)
2. Add it in [Settings > Developers](/?t=settings&s=developers) as `SKILLSMP_API_KEY`

### From Zo Chat

```
Search SkillsMP for "SEO" skills
Find skills on SkillsMP about building a web scraper
```

### From Terminal

```bash
cd Skills/zo-persona-creator/scripts

# Keyword search
bun skillsmp.ts search "SEO"

# AI semantic search — finds conceptually related skills
bun skillsmp.ts ai-search "How to create a web scraper"

# Sort by popularity, paginate
bun skillsmp.ts search "financial" --sort stars --limit 10

# Check API status and remaining quota
bun skillsmp.ts status
```

**Rate limit:** 500 requests/day per API key. See [full API docs](https://skillsmp.com/docs/api) for details.

---

## The 8-Phase Process

| Phase | Goal | Key Actions |
|-------|------|-------------|
| **1. Planning** | Define scope | Choose domain, expertise, capabilities, risks |
| **2. Template** | Start with structure | Copy template directory or run setup script |
| **3. Customize** | Tailor to needs | Edit persona prompt and safety rules |
| **4. MCP Servers** | Add data access | Connect to domain APIs via Model Context Protocol |
| **5. Enhancement** | Add value | Reporting, alerts, optimization, testing skills |
| **6. Documentation** | Create guides | SKILL.md, AGENTS.md, troubleshooting |
| **7. Testing** | Verify safety | Test persona, rules, skills, MCP, credentials |
| **8. Deployment** | Go live | Activate persona, share docs, schedule reviews |

For the full walkthrough, see [`SKILL.md`](SKILL.md) or [`references/MANUAL-SETUP-GUIDE.md`](references/MANUAL-SETUP-GUIDE.md).

---

## Repository Structure

```
zo-persona-creator/
├── SKILL.md                              # Complete guide (8-phase process)
├── QUICKSTART.md                         # 5-minute quick reference
├── README.md                             # This file
├── scripts/
│   ├── setup-persona.ts                  # Automated setup (non-interactive)
│   ├── interactive-setup.ts              # Guided setup with prompts
│   ├── validate-persona.ts              # Validate persona health
│   └── skillsmp.ts                      # Search SkillsMP marketplace via API
├── assets/
│   ├── persona-prompt-template.md        # Customizable persona prompt
│   ├── safety-rules-template.md          # Domain safety rules
│   ├── skill-template.ts                # Bun/TypeScript skill scaffold
│   ├── mcp-wrapper-template.sh          # MCP server wrapper
│   ├── soul-md-template.md              # SOUL.md constitution (OpenClaw-compatible)
│   ├── identity-md-template.md          # IDENTITY.md presentation layer
│   ├── user-md-template.md              # USER.md human profile
│   └── heartbeat-md-template.md         # HEARTBEAT.md scheduled tasks
├── references/
│   ├── MANUAL-SETUP-GUIDE.md            # Step-by-step manual process
│   └── TROUBLESHOOTING.md              # Common issues and fixes
└── examples/
    ├── healthcare-advisor/              # Healthcare domain example
    ├── legal-researcher/                # Legal domain example
    └── devops-engineer/                 # Complete persona package example
```

---

## SOUL / IDENTITY / USER / HEARTBEAT Architecture

For a more structured approach — popular with OpenClaw and Claude Code users — this skill includes templates for the layered identity file pattern:

```
SOUL.md (constitution — principles, boundaries, safety)
    ↓ inherited by
IDENTITY/[persona].md (presentation — tone, responsibilities, tools)
    ↓ personalized by
USER.md (human context — preferences, projects, risk tolerance)
    ↓ automated by
HEARTBEAT.md (scheduled tasks — health checks, alerts, reports)
```

| File | Scope | Purpose | Template |
|------|-------|---------|----------|
| **SOUL.md** | Global (all personas) | Non-negotiable principles and safety boundaries | `assets/soul-md-template.md` |
| **IDENTITY.md** | Per-persona | Tone, style, responsibilities, domain expertise, tool preferences | `assets/identity-md-template.md` |
| **USER.md** | Global (all personas) | Communication preferences, active projects, risk tolerance | `assets/user-md-template.md` |
| **HEARTBEAT.md** | Per-persona (optional) | Scheduled health checks, data refreshes, reports, alerts | `assets/heartbeat-md-template.md` |

**Why use this pattern?**
- **Version-controlled** — Persona changes are tracked in git, not buried in UI settings
- **Portable** — Works on Zo Computer, Claude Code, OpenClaw, and any platform that reads markdown context files
- **Auditable** — Clear separation of concerns makes persona behavior reviewable
- **Composable** — SOUL.md shared by all personas reduces duplication

**Zo-specific:** On Zo Computer, HEARTBEAT.md tasks map directly to Zo Agents with rrule scheduling and email/SMS delivery. See the template for exact rrule syntax.

See [`examples/devops-engineer/`](examples/devops-engineer/) for a complete working example with all four files.

---

## Implementation Examples

### Example 1: Financial Advisor (from Zo chat)

```
Create a Financial Advisor persona using the zo-persona-creator skill.
It should have access to Alpha Vantage and Alpaca MCP servers.
Add safety rules requiring trade confirmation and position size limits.
```

Zo will:
1. Run the setup script to scaffold `Skills/financial-advisor-skill/`
2. Customize the prompt for financial expertise
3. Create 5 safety rules (trade confirmation, position sizing, stop-loss, disclaimers, paper trading)
4. Set up MCP wrapper scripts for market data
5. Register the persona in Settings > Personas

### Example 2: Brand Guardian (from terminal, using agency-agents)

```bash
# 1. Review the agency-agents reference
cat agency-agents/design/design-brand-guardian.md

# 2. Generate the persona scaffold
cd Skills/zo-persona-creator/scripts
bun setup-persona.ts "Brand Guardian" design

# 3. Customize using the agency-agents personality as reference
# Edit Skills/brand-guardian-skill/assets/prompt.md

# 4. Validate
bun validate-persona.ts brand-guardian-skill
```

### Example 3: Multi-agent team composition (from Zo chat)

```
I need a QA team for my web project. Create personas based on these
agency-agents: Evidence Collector, Reality Checker, and Performance
Benchmarker. Each should have appropriate safety rules and skills.
Use the zo-persona-creator skill.
```

### Example 4: Full persona package with SOUL/IDENTITY/USER/HEARTBEAT (from Zo chat)

```
Set up a complete DevOps Engineer persona using the zo-persona-creator skill.
Include SOUL.md, IDENTITY file, USER.md, and a HEARTBEAT with hourly
health checks and a daily ops summary. Use the devops-engineer example
as a reference.
```

### Example 4 via terminal:

```bash
# 1. Copy the templates
cp Skills/zo-persona-creator/assets/soul-md-template.md SOUL.md
cp Skills/zo-persona-creator/assets/user-md-template.md USER.md
mkdir -p IDENTITY
cp Skills/zo-persona-creator/assets/identity-md-template.md IDENTITY/devops-engineer.md

# 2. Customize each file (replace placeholders)
# Edit SOUL.md — set your workspace principles
# Edit USER.md — set your profile, preferences, projects
# Edit IDENTITY/devops-engineer.md — set role, tone, responsibilities

# 3. Generate the skill scaffold
cd Skills/zo-persona-creator/scripts
bun setup-persona.ts "DevOps Engineer" infrastructure

# 4. Create heartbeat agents via Zo chat:
# "Create a Zo Agent that checks service health every 30 minutes. SMS me on failures."
```

---

## Design Principles

These principles are baked into every template and script:

1. **Safety First** — All safety rules are created before capabilities are enabled
2. **MCP + Skills Hybrid** — MCP for natural language AI interaction; skills for automation and scripting
3. **Environment-Based Config** — Credentials never hardcoded; always from Zo's encrypted vault
4. **Bun/TypeScript** — Zero-dependency runtime, single-file scripts, fast execution
5. **Modular Design** — Core skills, enhancement skills, and MCP servers are independently add/removable

---

## Related Resources

- [**Agency Agents**](https://github.com/msitarzewski/agency-agents) — 52 reference agent personalities (MIT)
- [**Zo Computer**](https://zo.computer) — The platform this skill is built for
- [**SkillsMP**](https://skillsmp.com) — Community skills marketplace with [REST API](https://skillsmp.com/docs/api)
- [**Agent Skills Spec**](https://agentskills.io/specification) — The skill format standard
- [`SKILL.md`](SKILL.md) — Full 8-phase creation guide
- [`QUICKSTART.md`](QUICKSTART.md) — 5-minute quick reference
- [`references/TROUBLESHOOTING.md`](references/TROUBLESHOOTING.md) — Common issues and fixes

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-improvement`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-improvement`)
5. Open a Pull Request

---

## License

MIT License — Use freely, commercially or personally.
