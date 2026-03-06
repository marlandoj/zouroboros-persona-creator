# Persona Creation Template - Quick Start

Create a new AI persona in 5 minutes.

## ⚡ Super Quick Start (Automated)

```bash
cd Skills/zo-persona-creator/scripts
bun setup-persona.ts "My Persona Name" my-domain
```

Then follow the on-screen instructions.

---

## 📋 Step-by-Step Quick Start

### Step 1: Plan Your Persona (2 min)

Answer these questions:
1. **Domain**: What field? (financial, healthcare, legal, creative, etc.)
2. **Expertise**: What specific knowledge? (advisor, analyst, researcher)
3. **Data**: What real-time data does it need?
4. **Risks**: What could go wrong?

### Step 2: Run Setup Script (1 min)

```bash
cd Skills/zo-persona-creator/scripts
bun setup-persona.ts "Health Coach" healthcare
```

This creates:
- `Skills/health-coach-skill/` - Your skill directory
- `SKILL.md` - Documentation
- `scripts/health-coach.ts` - Main script
- `scripts/health-coach-report.ts` - Enhancement script

### Step 3: Customize Templates (5 min)

Edit the generated files:

**1. Persona Prompt** (`assets/persona-prompt-template.md`)
```bash
# Copy and customize
cp assets/persona-prompt-template.md Skills/health-coach-skill/assets/prompt.md
nano Skills/health-coach-skill/assets/prompt.md
```

**2. Safety Rules** (`assets/safety-rules-template.md`)
```bash
# Review domain-specific rules
cat assets/safety-rules-template.md
```

**3. Skill Script** (`scripts/health-coach.ts`)
```bash
# Customize for your API
nano Skills/health-coach-skill/scripts/health-coach.ts
```

### Step 4: Create Persona & Rules (2 min)

Go to [Settings > Personas](/?t=settings&s=your-ai&d=personas):
1. Click "Create New Persona"
2. Name: "Health Coach"
3. Paste your customized prompt
4. Save and note the ID

Go to [Settings > Rules](/?t=settings&s=your-ai&d=rules):
1. Create safety rules from template
2. Test they trigger correctly

### Step 5: Add API Keys (1 min)

Go to [Settings > Developers](/?t=settings&s=developers):
1. Add your API key
2. Name it `HEALTHCARE_API_KEY` (or your domain)

### Step 6: Test (2 min)

```bash
# Test skill
cd Skills/health-coach-skill/scripts
bun health-coach.ts status

# Test persona
# Ask: "What can you help me with?"
```

---

## 📁 What Gets Created

After running setup, you'll have:

```
Skills/
└── health-coach-skill/
    ├── SKILL.md                    # Documentation
    ├── scripts/
    │   ├── health-coach.ts         # Main skill
    │   └── health-coach-report.ts  # Enhancement
    ├── assets/
    │   └── prompt.md               # Persona prompt
    └── references/
        └── TROUBLESHOOTING.md      # (create if needed)
```

---

## 🎯 Next Steps

1. **Add MCP Server** (optional): Enable natural language data access
2. **Create Enhancement Skills**: Reporting, alerts, optimization
3. **Update AGENTS.md**: Track your persona and capabilities
4. **Document Usage**: Add examples to your SKILL.md

---

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| Setup fails | Check `references/TROUBLESHOOTING.md` |
| API errors | Verify key in Settings > Developers |
| Rules not working | Test condition matches exactly |
| Want examples | See `examples/` directory |
| Full guide | Read `SKILL.md` |

---

## 🔄 Common Workflows

### Add a New Skill
```bash
cd Skills/health-coach-skill/scripts
cat > nutrition.ts << 'EOF'
#!/usr/bin/env bun
console.log("Nutrition skill ready!");
EOF
chmod +x nutrition.ts
```

### Update Persona
1. Edit prompt in Settings > Personas
2. Test with sample queries
3. Update AGENTS.md

### Add Safety Rule
1. Go to Settings > Rules
2. Create rule from template
3. Test with trigger phrase

---

## ✅ Pre-Deployment Checklist

- [ ] Persona responds with correct expertise
- [ ] Safety rules trigger appropriately
- [ ] Skill returns valid data
- [ ] API keys configured
- [ ] Documentation complete
- [ ] AGENTS.md updated

---

**Full Documentation**: See `SKILL.md`  
**Examples**: See `examples/` directory  
**Manual Setup**: See `references/MANUAL-SETUP-GUIDE.md`
