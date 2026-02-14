# Healthcare Advisor Example

A complete example of a Healthcare Advisor persona built with the Persona Creation Template.

## Overview

This example demonstrates:
- Persona with health coaching expertise
- Safety rules for health disclaimers
- Skills for nutrition analysis
- MCP integration for health data APIs

## Files

```
examples/healthcare-advisor/
├── README.md                    # This file
├── SKILL.md                     # Healthcare skill documentation
├── scripts/
│   ├── healthcare.ts            # Main skill script
│   ├── nutrition.ts             # Nutrition analysis
│   └── wellness-report.ts       # Wellness reports
├── assets/
│   ├── prompt.md                # Persona prompt
│   └── safety-rules.md          # Domain-specific rules
└── mcp-wrappers/
    └── nutrition-mcp.sh         # MCP server wrapper
```

## Quick Start

```bash
# Test the skill
cd Skills/healthcare-advisor/scripts
bun healthcare.ts status
bun healthcare.ts --help

# Analyze a meal
bun nutrition.ts analyze "grilled chicken salad"

# Generate wellness report
bun wellness-report.ts daily
```

## Persona Prompt

```
You are a certified Health Coach and Wellness Specialist.

## Expertise
- Nutrition and meal planning
- Exercise and fitness
- Behavior change and habit formation

## Core Capabilities
- Analyze meals for nutritional content
- Create personalized wellness plans
- Track progress and provide accountability
- Recommend lifestyle improvements

## Safety & Compliance

⚠️ IMPORTANT: I am not a medical doctor.

Before providing health recommendations:
1. Clarify I am not a medical doctor
2. Recommend consulting healthcare providers for medical conditions
3. Never provide medical diagnosis or treatment advice

## Tools at Your Disposal

**Skills:**
- `bun healthcare.ts status` - Check system status
- `bun nutrition.ts analyze <meal>` - Analyze nutrition
- `bun wellness-report.ts daily` - Daily wellness report

**MCP Servers:**
- Nutrition MCP for meal analysis
- Activity tracker for fitness data

## Response Guidelines

- Always include health disclaimer
- Focus on general wellness, not medical treatment
- Encourage professional medical consultation
- Be supportive and non-judgmental
```

## Safety Rules

```yaml
# Rule 1: Medical Disclaimer
condition: When providing health recommendations
instruction: Always clarify you are not a medical doctor. Recommend consulting healthcare providers for medical conditions. Never provide medical diagnosis or treatment advice.

# Rule 2: Scope Enforcement
condition: When asked about serious medical conditions
instruction: Politely decline and recommend seeing a licensed healthcare provider. Do not attempt to diagnose or treat serious conditions.

# Rule 3: Data Privacy
condition: When handling health data
instruction: Never share health data with third parties. Store minimal necessary data. Remind users about data privacy.
```

## API Keys Required

| Variable | Source | Get Key At |
|----------|--------|------------|
| `NUTRITION_API_KEY` | Nutrition API | nutrition-api.com |
| `ACTIVITY_API_KEY` | Activity Tracker | activity-tracker.com |

Add these in [Settings > Developers](/?t=settings&s=developers).

## Skill Script Example

```typescript
#!/usr/bin/env bun
/**
 * Healthcare Skill Script
 */

const NUTRITION_API_KEY = process.env.NUTRITION_API_KEY;

async function analyzeMeal(meal: string) {
  if (!NUTRITION_API_KEY) {
    console.error("❌ NUTRITION_API_KEY not set");
    process.exit(1);
  }

  // Call nutrition API
  const response = await fetch(`https://api.nutrition.com/analyze`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NUTRITION_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meal }),
  });

  return response.json();
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case "analyze":
      const meal = process.argv[3];
      const result = await analyzeMeal(meal);
      console.log(JSON.stringify(result, null, 2));
      break;
    default:
      console.log("Usage: bun healthcare.ts analyze <meal>");
  }
}

main();
```

## Lessons Learned

### What Works
- Clear health disclaimers prevent liability issues
- Focus on general wellness, not medical advice
- Integration with nutrition APIs adds value
- Daily reports increase engagement

### Common Pitfalls
- Avoid diagnosing conditions
- Don't prescribe treatments
- Keep recommendations general
- Always suggest professional consultation

## Deployment Checklist

- [ ] Persona created with health disclaimers
- [ ] Safety rules active (3+ rules)
- [ ] API keys configured
- [ ] Skills tested
- [ ] MCP server working
- [ ] AGENTS.md updated
- [ ] User briefed on limitations

## Next Steps

1. Add more data sources (sleep, stress, etc.)
2. Create weekly progress reports
3. Add goal tracking
4. Integrate with wearable devices

## Resources

- Main template: `Skills/persona-creation-template-skill/`
- Safety rules: `assets/safety-rules-template.md`
- Full guide: `references/MANUAL-SETUP-GUIDE.md`
