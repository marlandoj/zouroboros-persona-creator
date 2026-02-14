# Manual Setup Guide

Complete manual process for creating a persona. Use this if automated setup doesn't work.

---

## Phase 1: Define Persona

### 1.1 Choose Domain
Select your area of expertise:
- Financial
- Healthcare
- Legal
- Creative
- Education
- Technical
- Other: ______

### 1.2 Define Expertise
List 3-5 specific areas:
1. _______________
2. _______________
3. _______________

### 1.3 Identify Capabilities
What can this persona do?
- [ ] Access real-time data
- [ ] Provide recommendations
- [ ] Execute actions
- [ ] Analyze information
- [ ] Generate reports
- [ ] Send alerts

### 1.4 Assess Risks
What could go wrong?
- Financial loss: □
- Health risks: □
- Legal liability: □
- Privacy breach: □
- Misinformation: □
- Other: _________

---

## Phase 2: Create Persona

### 2.1 Write Prompt
Use template from `assets/persona-prompt-template.md`:

```markdown
You are an experienced [EXPERTISE] specializing in [DOMAIN]...
```

### 2.2 Create via Settings
1. Go to [Settings > Personas](/?t=settings&s=your-ai&d=personas)
2. Click "Create New Persona"
3. Name: [Your Persona Name]
4. Paste your prompt
5. Save

### 2.3 Note Persona ID
Record the ID for AGENTS.md tracking.

---

## Phase 3: Create Safety Rules

### 3.1 Identify Required Rules
Based on Phase 1.4 risks, determine needed rules:

| Risk | Rule Type | Trigger |
|------|-----------|---------|
| Financial loss | Confirmation | Before transactions |
| Health risks | Disclaimer | All health advice |
| Privacy breach | Data masking | When displaying data |

### 3.2 Create Rules
Use template from `assets/safety-rules-template.md`:

```bash
# Use create_rule tool
condition: "When [TRIGGER]"
instruction: "[SAFEGUARD ACTION]"
```

Create at least:
- [ ] 1 universal rule (verification)
- [ ] 1 domain-specific rule
- [ ] 1 action-confirmation rule

### 3.3 Test Rules
Simulate scenarios to verify rules trigger:
- Try action that should require confirmation
- Request advice that needs disclaimer
- Access data that should be masked

---

## Phase 4: Create Skills

### 4.1 Plan Skills
List needed skills:

| Skill | Purpose | API Needed |
|-------|---------|------------|
| core | Main functionality | Yes/No |
| report | Generate reports | Yes/No |
| alert | Send notifications | Yes/No |

### 4.2 Create Skill Structure
```bash
mkdir -p Skills/<your-persona>-skill/{scripts,assets,references}
cd Skills/<your-persona>-skill
```

### 4.3 Write SKILL.md
```markdown
---
name: <your-persona>-skill
description: [Description]
---

# [Persona Name] Skill

## Usage
```
bun scripts/<skill>.ts --help
```

## API Keys
[If needed]
```

### 4.4 Write Script
Create `scripts/<skill>.ts`:

```typescript
#!/usr/bin/env bun
const API_KEY = process.env.YOUR_API_KEY;

async function main() {
  // Your implementation
}

main();
```

Make executable:
```bash
chmod +x scripts/<skill>.ts
```

### 4.5 Test Skill
```bash
bun scripts/<skill>.ts --help
bun scripts/<skill>.ts status
```

---

## Phase 5: MCP Servers

### 5.1 Research MCP Servers
Search for official MCP servers:
```
<domain> MCP server github
```

Examples:
- Financial: alphavantage/alpha_vantage_mcp
- Healthcare: [health data mcp]
- Legal: [legal research mcp]

### 5.2 Create Wrapper
Create `mcp-wrappers/<domain>-mcp-wrapper.sh`:

```bash
#!/bin/bash
export PATH="$HOME/.local/bin:$PATH"
export API_KEY="${YOUR_API_KEY}"

if [ -z "$API_KEY" ]; then
  echo "Error: API_KEY not set" >&2
  exit 1
fi

exec uvx --from git+https://github.com/<org>/<repo> <command> "$API_KEY"
```

Make executable:
```bash
chmod +x mcp-wrappers/<domain>-mcp-wrapper.sh
```

### 5.3 Test MCP
```bash
./mcp-wrappers/<domain>-mcp-wrapper.sh
```

Should start without errors.

---

## Phase 6: Documentation

### 6.1 Update AGENTS.md
Add to `/home/workspace/AGENTS.md`:

```markdown
## Active Personas

### [Persona Name] ✅
- **Status:** Active
- **ID:** [persona-id]
- **Domain:** [domain]
- **Safety Rules:** [number] active

### Skills
| Skill | Status | Location |
|-------|--------|----------|
| [skill-name] | ✅ Ready | `Skills/[skill]/` |

### API Keys
| Variable | Source | Status |
|----------|--------|--------|
| [KEY_NAME] | [provider] | [Configured/Needed] |
```

### 6.2 Create Usage Guide
In your skill directory, create:
- README.md - Quick start
- references/TROUBLESHOOTING.md - Common issues
- references/API-REFERENCE.md - API documentation

---

## Phase 7: Testing

### 7.1 Component Testing
Test each component independently:

```bash
# Test persona
curl -X POST /zo/ask \
  -H "Content-Type: application/json" \
  -d '{"input": "Test prompt", "persona_id": "[your-id]"}'

# Test skill
bun Skills/<your-skill>/scripts/<script>.ts status

# Test MCP
./Skills/<your-skill>/mcp-wrappers/<mcp>.sh

# Test rules
# Try actions that should trigger rules
```

### 7.2 Integration Testing
Test complete workflow:

1. Start MCP server
2. Ask persona for data
3. Verify data is correct
4. Try action that triggers rule
5. Confirm rule prevents/allows appropriately

### 7.3 Safety Testing
Test edge cases:
- Invalid API keys
- Missing permissions
- Rate limiting
- Malformed requests
- Large data volumes

---

## Phase 8: Deployment

### 8.1 Enable Persona
1. Go to [Settings > Personas](/?t=settings&s=your-ai&d=personas)
2. Find your persona
3. Set as active
4. Test with simple query

### 8.2 Share Documentation
Ensure user has:
- Quick start guide
- Safety rule summary
- API key requirements
- Usage examples

### 8.3 Schedule Review
Set calendar reminder for:
- 1 week: Check for issues
- 1 month: Review usage
- 3 months: Safety audit

---

## Checklist

Before considering setup complete:

- [ ] Persona created with clear prompt
- [ ] At least 3 safety rules active
- [ ] Core skill tested and working
- [ ] MCP server starts without errors (if applicable)
- [ ] AGENTS.md updated
- [ ] Documentation complete
- [ ] User tested persona
- [ ] No credentials exposed
- [ ] Rate limits documented
- [ ] Review scheduled

---

## Common Issues

### "API key not set"
**Solution:** Add key in Settings > Developers

### "Command not found"
**Solution:** Install Bun: `curl -fsSL https://bun.sh/install | bash`

### "Permission denied"
**Solution:** Make scripts executable: `chmod +x scripts/*.ts`

### "MCP server won't start"
**Solution:** Check uvx installed: `$HOME/.local/bin/uvx --version`

### "Rate limit exceeded"
**Solution:** Check API tier, add delays, or upgrade

---

## Getting Help

If stuck:
1. Check `assets/` for templates
2. Review examples in `examples/`
3. Consult SKILL.md for best practices
4. Test components individually
5. Simplify and iterate