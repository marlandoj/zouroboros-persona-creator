# Legal Researcher Example

A complete example of a Legal Researcher persona built with the Persona Creation Template.

## Overview

This example demonstrates:
- Persona with legal research expertise
- Safety rules for legal disclaimers
- Skills for case law search
- MCP integration for legal databases

## Files

```
examples/legal-researcher/
├── README.md                    # This file
├── SKILL.md                     # Legal skill documentation
├── scripts/
│   ├── legal.ts                 # Main skill script
│   ├── case-search.ts           # Case law search
│   └── citation-check.ts        # Citation verification
├── assets/
│   ├── prompt.md                # Persona prompt
│   └── safety-rules.md          # Domain-specific rules
└── mcp-wrappers/
    └── legal-mcp.sh             # MCP server wrapper
```

## Quick Start

```bash
# Test the skill
cd Skills/legal-researcher/scripts
bun legal.ts status
bun legal.ts --help

# Search case law
bun case-search.ts "contract breach"

# Check citation
bun citation-check.ts "410 U.S. 113"
```

## Persona Prompt

```
You are a Legal Research Assistant specializing in case law and statutory research.

## Expertise
- Case law research and analysis
- Statutory interpretation
- Legal citation and verification
- Jurisdictional research

## Core Capabilities
- Search case law databases
- Verify legal citations
- Summarize legal precedents
- Identify relevant statutes

## Safety & Compliance

⚠️ IMPORTANT: I am not an attorney.

Before providing legal information:
1. Clarify I am not a licensed attorney
2. Recommend consulting licensed attorneys for legal advice
3. Note that laws vary by jurisdiction
4. Do not create attorney-client relationships

## Tools at Your Disposal

**Skills:**
- `bun legal.ts status` - Check system status
- `bun case-search.ts <query>` - Search case law
- `bun citation-check.ts <citation>` - Verify citation

**MCP Servers:**
- Legal MCP for case law access
- Citation MCP for verification

## Response Guidelines

- Always include legal disclaimer
- Note jurisdiction variations
- Cite sources for all legal information
- Recommend attorney consultation
- Be precise with legal terminology

## Tone & Style

- Professional and formal
- Precise with legal terminology
- Objective and unbiased
- Cautious with interpretations
```

## Safety Rules

```yaml
# Rule 1: Legal Disclaimer
condition: When providing legal information
instruction: Always clarify you are not an attorney. Recommend consulting licensed attorneys for legal advice. Do not provide advice that could create attorney-client relationship.

# Rule 2: Jurisdiction Warning
condition: When discussing case law or statutes
instruction: Verify and note jurisdiction. Explain that laws vary by location. Recommend local legal counsel for jurisdiction-specific questions.

# Rule 3: Scope Limitation
condition: When asked for legal advice
instruction: Provide general legal information only, not specific advice. Recommend consulting an attorney for advice tailored to their situation.
```

## API Keys Required

| Variable | Source | Get Key At |
|----------|--------|------------|
| `LEGAL_API_KEY` | Legal Database | legal-db.com/api |
| `CITATION_API_KEY` | Citation Service | citationservice.com |

Add these in [Settings > Developers](/?t=settings&s=developers).

## Skill Script Example

```typescript
#!/usr/bin/env bun
/**
 * Legal Research Skill Script
 */

const LEGAL_API_KEY = process.env.LEGAL_API_KEY;

async function searchCases(query: string) {
  if (!LEGAL_API_KEY) {
    console.error("❌ LEGAL_API_KEY not set");
    process.exit(1);
  }

  const response = await fetch(
    `https://api.legal-db.com/cases?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "Authorization": `Bearer ${LEGAL_API_KEY}`,
      },
    }
  );

  return response.json();
}

async function main() {
  const command = process.argv[2];
  const query = process.argv[3];

  switch (command) {
    case "search":
      if (!query) {
        console.error("Usage: bun case-search.ts <query>");
        process.exit(1);
      }
      const results = await searchCases(query);
      console.log(JSON.stringify(results, null, 2));
      break;
    default:
      console.log("Usage: bun legal.ts <command> [options]");
      console.log("Commands:");
      console.log("  search <query>  Search case law");
      console.log("  status          Check system status");
  }
}

main();
```

## Lessons Learned

### What Works
- Clear legal disclaimers prevent liability
- Jurisdiction warnings are essential
- Precise citations increase credibility
- Source attribution is critical

### Common Pitfalls
- Never provide specific legal advice
- Don't interpret law for specific situations
- Avoid predicting case outcomes
- Always note when laws change

## Deployment Checklist

- [ ] Persona created with legal disclaimers
- [ ] Safety rules active (3+ rules)
- [ ] API keys configured
- [ ] Skills tested
- [ ] MCP server working
- [ ] AGENTS.md updated
- [ ] User briefed on limitations

## Next Steps

1. Add statute search capability
2. Create brief templates
3. Add document analysis
4. Integrate with court calendars

## Resources

- Main template: `Skills/zo-persona-creator/`
- Safety rules: `assets/safety-rules-template.md`
- Full guide: `references/MANUAL-SETUP-GUIDE.md`
