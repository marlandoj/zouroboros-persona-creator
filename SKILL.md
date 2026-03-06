---
name: persona-creation-template-skill
description: Generalized blueprint for creating sophisticated personas on Zo Computer with safety rules, skills, MCP servers, and enhancement tools. Adaptable to any domain.
compatibility: Created for Zo Computer
metadata:
  author: zo.computer
  created: 2026-02-07
  version: 1.0.0
---
# Persona Creation Template Skill

A reusable blueprint for creating sophisticated AI personas on Zo Computer. This template provides:

- **8-Phase Creation Process** - From planning to deployment
- **Pre-built Templates** - Persona prompts, safety rules, skill code, MCP wrappers
- **Automated Tools** - Scripts to generate complete persona setups
- **Best Practices** - Learn from financial advisor implementation
- **Domain Adaptation** - Customize for any field
- **52 Reference Agents** - Built on the [Agency Agents](https://github.com/msitarzewski/agency-agents) framework

## Quick Start

Choose your path based on your preference:

### Option 1: Interactive Setup (Easiest - 5 minutes)
```bash
cd Skills/persona-creation-template-skill/scripts
bun interactive-setup.ts
```
Follow the guided prompts to create your complete persona setup.

### Option 2: Automated Setup (Fast - 2 minutes)
```bash
cd Skills/persona-creation-template-skill/scripts
bun setup-persona.ts "Health Coach" healthcare
```
Generates all files automatically. Then customize as needed.

### Option 3: Manual Setup (Full Control)
Follow the [8-Phase Process](#the-8-phase-process) below for complete manual control.

### Option 4: Quick Reference
Just need a quick reminder? See [`QUICKSTART.md`](QUICKSTART.md).

---

## The 8-Phase Process

## Phase 1: Planning

**Goal:** Define the persona's purpose and scope

### Actions:
1. Determine the domain (financial, healthcare, legal, etc.)
2. Identify the persona's expertise (advisor, analyst, researcher)
3. List the desired capabilities (data, analysis, recommendations)
4. Identify potential risks
5. **Browse [Agency Agents](https://github.com/msitarzewski/agency-agents) for reference personas** in your target domain

### Using Agency Agents as Starting Points

The [Agency Agents](https://github.com/msitarzewski/agency-agents) repo provides 52 battle-tested agent personalities across 9 divisions (Engineering, Design, Marketing, Product, Project Management, Testing, Support, Spatial Computing, Specialized). Each agent file includes:

- **Identity & Memory** — Personality traits, communication style, expertise areas
- **Core Mission** — Detailed deliverables and step-by-step workflows
- **Critical Rules** — Domain-specific constraints and guardrails
- **Success Metrics** — Measurable outcomes and quality standards

Browse agents to find a reference personality for your persona:

```bash
# Clone agency-agents if not already present
git clone https://github.com/msitarzewski/agency-agents.git

# Browse by division
ls agency-agents/engineering/
ls agency-agents/design/
ls agency-agents/marketing/

# Read a specific agent for reference
cat agency-agents/design/design-brand-guardian.md
```

You can also ask Zo in natural language:

```
Show me agency-agents that would be relevant for a customer support persona.
```

### Planning Template:
```bash
# Answer these questions:
# 1. What domain? (financial, healthcare, legal, etc.)
# 2. What expertise? (advisor, analyst, researcher)
# 3. What capabilities? (data, analysis, recommendations)
# 4. What risks? (what could go wrong)
# 5. Which agency-agents reference persona(s) to base on? (optional)
```

## Phase 2: Copying the Template

**Goal:** Start with a pre-built structure

### Actions:
1. Copy the template directory
2. Navigate into the new directory

### Copying Template:
```bash
cp -r Skills/persona-creation-template-skill Skills/<your-persona>-skill
cd Skills/<your-persona>-skill
```

## Phase 3: Customizing Assets

**Goal:** Tailor the persona to your needs

### Actions:
1. Edit the persona prompt
2. Edit the safety rules

### Customization:
```bash
# Edit persona prompt
nano assets/persona-prompt-template.md

# Edit safety rules
nano assets/safety-rules-template.md
```

## Phase 4: MCP Servers (AI Integration)

**Goal:** Enable natural language interaction with real-time data

### Actions:
1. Research official MCP servers for your domain
2. Create wrapper scripts for Zo-specific config
3. Store API keys in Zo vault
4. Test MCP servers work independently

### MCP Server Examples:
- **Financial:** Alpha Vantage, Alpaca, FRED
- **Healthcare:** Clinical data APIs
- **Legal:** Case law databases
- **Creative:** Design tool APIs

### Wrapper Script Template:
```bash
#!/bin/bash
# MCP Server Wrapper for Zo Computer

export PATH="$HOME/.local/bin:$PATH"
export MCP_API_KEY="${YOUR_DOMAIN_API_KEY}"

if [ -z "$MCP_API_KEY" ]; then
  echo "Error: MCP_API_KEY not set in Settings > Developers" >&2
  exit 1
fi

exec uvx --from git+https://github.com/<org>/<mcp-repo> <command> "$MCP_API_KEY"
```

### What Works:
- Use official/verified MCP servers when available
- Wrap in shell scripts for Zo-specific environment setup
- Share API keys between skills and MCPs for consistency

## Phase 5: Enhancement Skills

**Goal:** Add value beyond basic functionality

### Enhancement Categories:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Reporting** | Summaries, dashboards | Daily reports, weekly digests |
| **Alerts** | Proactive notifications | Threshold alerts, event triggers |
| **Optimization** | Efficiency improvements | Cost optimization, best practices |
| **Testing** | Validation tools | Backtesting, simulations, what-if |

### Skill Template:
```typescript
#!/usr/bin/env bun
const API_KEY = process.env.YOUR_DOMAIN_API_KEY;

if (!API_KEY) {
  console.error("Error: YOUR_DOMAIN_API_KEY not set");
  process.exit(1);
}

async function main() {
  const command = process.argv[2];
  // Implementation here
}

main();
```

## Phase 6: Documentation

**Goal:** Create reference materials and usage guides

### Files to Create:
1. **Skill README** (`SKILL.md`) - Complete usage guide
2. **AGENTS.md update** - Track persona and rules
3. **MCP Setup Guide** - How to use MCP servers
4. **Troubleshooting Guide** - Common issues

### Documentation Template Structure:
```markdown
## Overview
## Quick Start
## Core Capabilities
## Enhancement Features
## Safety Rules
## API Keys Required
## Usage Examples
## Troubleshooting
```

## Phase 7: Testing

**Goal:** Verify everything works safely

### Testing Checklist:
- [ ] Persona responds with correct tone/expertise
- [ ] Safety rules trigger appropriately
- [ ] Core skills return valid data
- [ ] MCP servers start and respond
- [ ] Enhancement skills work
- [ ] No credentials exposed in output

### Test Environments:
1. **Safe Mode** - Use test/sandbox APIs
2. **Limited Scope** - Start with read-only operations
3. **Gradual Expansion** - Add capabilities incrementally

## Phase 8: Deployment

**Goal:** Enable the persona for regular use

### Deployment Steps:
1. Activate persona in [Settings > Personas](/?t=settings&s=your-ai&d=personas)
2. Share documentation with user
3. Provide quick-start examples
4. Schedule regular reviews

## What Works: Best Practices

### ✅ Most Efficient Approaches

1. **MCP + Skills Hybrid**
   - MCP for natural language AI interaction
   - Skills for automation and scripting
   - Both share API keys from Zo's vault

2. **Safety-First Architecture**
   - Create ALL safety rules BEFORE enabling capabilities
   - Rules enforce behavior, not documentation
   - Test rule triggers before deployment

3. **Bun/TypeScript for Skills**
   - Zero-dependency runtime (no node_modules)
   - Single-file scripts with inline types
   - Fast execution and easy maintenance

4. **Environment-Based Configuration**
   - NEVER hardcode credentials
   - Always use Settings > Developers vault
   - Validate keys exist before use

5. **Modular Design**
   - Core skills = essential functionality
   - Enhancement skills = value-add
   - MCP servers = AI integration
   - Easy to add/remove components

### ⚠️ Common Pitfalls to Avoid

1. **Skipping Safety Rules**
   - Creates liability and risk
   - Hard to add after capabilities exist

2. **Hardcoding Credentials**
   - Security risk
   - Prevents sharing/reusability

3. **Ignoring Rate Limits**
   - Service degradation
   - API key suspension

4. **Over-Engineering Phase 1**
   - Start simple, add incrementally
   - Test each component independently

5. **Poor Documentation**
   - User confusion
   - Future maintenance burden

## Files Reference

### Core Files
| File | Purpose |
|------|---------|
| `SKILL.md` | This guide |
| `QUICKSTART.md` | Quick reference guide |
| `scripts/setup-persona.ts` | Automated setup (non-interactive) |
| `scripts/interactive-setup.ts` | Interactive setup (guided prompts) |
| `scripts/validate-persona.ts` | Validate persona setup |

### Templates
| File | Purpose |
|------|---------|
| `assets/persona-prompt-template.md` | Persona prompt template |
| `assets/safety-rules-template.md` | Safety rules template |
| `assets/skill-template.ts` | Skill code template |
| `assets/mcp-wrapper-template.sh` | MCP wrapper template |

### Guides
| File | Purpose |
|------|---------|
| `references/MANUAL-SETUP-GUIDE.md` | Step-by-step manual setup |
| `references/TROUBLESHOOTING.md` | Common issues |
| `references/MCP-REFERENCE.md` | MCP server details |

### Examples
| File | Purpose |
|------|---------|
| `examples/financial-advisor/` | Financial domain example |
| `examples/healthcare-advisor/` | Healthcare domain example |
| `examples/legal-researcher/` | Legal domain example |

## Domain Adaptation Guide

### Financial → Healthcare
| Financial Component | Healthcare Equivalent |
|--------------------|----------------------|
| Stock quotes | Patient records |
| Trading | Treatment recommendations |
| Portfolio | Care plans |
| Risk management | Patient safety |
| SEC filings | Clinical trials |

### Financial → Legal
| Financial Component | Legal Equivalent |
|--------------------|-----------------|
| Stock quotes | Case law |
| Trading | Filing deadlines |
| Portfolio | Case portfolio |
| Risk management | Compliance |
| SEC filings | Court records |

### Financial → Creative
| Financial Component | Creative Equivalent |
|--------------------|--------------------|
| Stock quotes | Design trends |
| Trading | Asset purchases |
| Portfolio | Project archive |
| Risk management | Brand consistency |
| SEC filings | Licensing records |

## Maintenance

### Adding New Capabilities
1. Design skill following existing patterns
2. Add safety rules if needed
3. Document in SKILL.md
4. Update AGENTS.md

### Rotating API Keys
1. Update in [Settings > Developers](/?t=settings&s=developers)
2. Restart MCP servers
3. Test all skills

### Updating MCP Servers
1. Check for upstream updates
2. Test in isolation
3. Deploy incrementally

## Resources

- `references/MANUAL-SETUP-GUIDE.md` - Detailed manual steps
- `references/TROUBLESHOOTING.md` - Common issues and solutions
- `references/MCP-REFERENCE.md` - MCP server documentation
- `examples/` - Domain-specific examples
- [Agency Agents](https://github.com/msitarzewski/agency-agents) - 52 reference agent personalities (MIT) by [@msitarzewski](https://github.com/msitarzewski)
- [README.md](README.md) - Implementation guide with Zo chat and terminal workflows

## Support

For issues or enhancements:
1. Check `references/TROUBLESHOOTING.md`
2. Review examples in `examples/`
3. Follow the 8-phase process step-by-step

## Notes

- The swarm orchestrator skill has been renamed to zo-swarm-orchestrator; repo: https://github.com/marlandoj/zo-swarm-orchestrator.
- This skill uses [Agency Agents](https://github.com/msitarzewski/agency-agents) by [@msitarzewski](https://github.com/msitarzewski) as a reference framework for agent personality patterns and domain specializations.