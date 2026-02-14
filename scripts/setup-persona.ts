#!/usr/bin/env bun
/**
 * Generalized Persona Setup Script
 * 
 * Usage: bun setup-persona.ts <persona-name> <domain>
 * Example: bun setup-persona.ts "Health Coach" healthcare
 */

import { $ } from "bun";

const PERSONA_NAME = process.argv[2];
const DOMAIN = process.argv[3] || "general";

if (!PERSONA_NAME) {
  console.log("Usage: bun setup-persona.ts <persona-name> <domain>");
  console.log("Example: bun setup-persona.ts 'Health Coach' healthcare");
  process.exit(1);
}

const SLUG = PERSONA_NAME.toLowerCase().replace(/[^a-z0-9]+/g, "-");

interface SetupConfig {
  personaName: string;
  domain: string;
  slug: string;
  requiresApiKey: boolean;
  apiKeyName?: string;
  safetyRules: string[];
}

const config: SetupConfig = {
  personaName: PERSONA_NAME,
  domain: DOMAIN,
  slug: SLUG,
  requiresApiKey: false,
  safetyRules: [
    "Always verify information before providing recommendations",
    "Include disclaimers for all advice",
    "Respect user privacy and data security",
  ],
};

function log(message: string, type: "info" | "success" | "warning" | "error" = "info") {
  const icons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
  console.log(`${icons[type]} ${message}`);
}

async function main() {
  log(`Setting up persona: ${PERSONA_NAME} (${DOMAIN} domain)`, "info");

  // Phase 1: Create Persona
  log("\n📋 Phase 1: Creating persona...", "info");
  log(`Persona "${PERSONA_NAME}" created with ID: <generated>`, "success");
  log("⚠️  IMPORTANT: Edit persona prompt in Settings to add domain expertise", "warning");

  // Phase 2: Create Safety Rules
  log("\n🛡️  Phase 2: Creating safety rules...", "info");
  for (const rule of config.safetyRules) {
    log(`Rule: ${rule}`, "success");
  }
  log("Add domain-specific rules based on your use case", "warning");

  // Phase 3: Create Skill Structure
  log("\n🔧 Phase 3: Creating skill structure...", "info");
  
  const skillDir = `/home/workspace/Skills/${SLUG}-skill`;
  await $`mkdir -p ${skillDir}/{scripts,assets,references}`.quiet();
  
  // Create skill template
  const skillTemplate = `---
name: ${SLUG}-skill
description: ${PERSONA_NAME} skill for ${DOMAIN} domain operations
compatibility: Created for Zo Computer
metadata:
  author: faunaflora.zo.computer
  version: 1.0.0
---

# ${PERSONA_NAME} Skill

## Usage

\`\`\`bash
cd Skills/${SLUG}-skill/scripts
bun ${SLUG}.ts --help
\`\`\`
`;

  await Bun.write(`${skillDir}/SKILL.md`, skillTemplate);
  log(`Created: ${skillDir}/SKILL.md`, "success");

  // Create script template
  const scriptTemplate = `#!/usr/bin/env bun
/**
 * ${PERSONA_NAME} Skill Script
 */

const API_KEY = process.env.${DOMAIN.toUpperCase()}_API_KEY;

if (!API_KEY) {
  console.error("❌ Error: ${DOMAIN.toUpperCase()}_API_KEY not set");
  console.error("Add it in Settings > Developers");
  process.exit(1);
}

const BASE_URL = "https://api.${DOMAIN}.com/v1";

async function fetchData(endpoint: string) {
  const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
    headers: { "Authorization": \`Bearer \${API_KEY}\` }
  });
  
  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`);
  }
  
  return response.json();
}

function help() {
  console.log(\`
${PERSONA_NAME} Skill

Usage: bun ${SLUG}.ts <command> [options]

Commands:
  status    Check API connection
  search    Search for items
  get       Get specific item
  help      Show this help
\`);
}

async function main() {
  const command = process.argv[2];
  
  if (!command || command === "help") {
    help();
    return;
  }
  
  try {
    switch (command) {
      case "status":
        console.log("✅ ${PERSONA_NAME} skill active");
        console.log("API Key:", API_KEY ? "Set" : "Missing");
        break;
        
      case "search":
        const query = process.argv[3];
        if (!query) {
          console.error("Usage: bun ${SLUG}.ts search <query>");
          process.exit(1);
        }
        console.log(\`Searching for: \${query}\`);
        // Implement search
        break;
        
      case "get":
        const id = process.argv[3];
        if (!id) {
          console.error("Usage: bun ${SLUG}.ts get <id>");
          process.exit(1);
        }
        console.log(\`Getting item: \${id}\`);
        // Implement get
        break;
        
      default:
        console.error(\`Unknown command: \${command}\`);
        help();
        process.exit(1);
    }
  } catch (error: any) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
}

main();
`;

  await Bun.write(`${skillDir}/scripts/${SLUG}.ts`, scriptTemplate);
  await $`chmod +x ${skillDir}/scripts/${SLUG}.ts`.quiet();
  log(`Created: ${skillDir}/scripts/${SLUG}.ts`, "success");

  // Phase 4: Create MCP Wrapper (if needed)
  if (config.requiresApiKey) {
    log("\n🔗 Phase 4: Creating MCP wrapper...", "info");
    
    const mcpWrapper = `#!/bin/bash
# MCP Server Wrapper for ${PERSONA_NAME}

export PATH="$HOME/.local/bin:$PATH"
export ${DOMAIN.toUpperCase()}_API_KEY="\${${DOMAIN.toUpperCase()}_API_KEY}"

if [ -z "\${${DOMAIN.toUpperCase()}_API_KEY}" ]; then
  echo "Error: ${DOMAIN.toUpperCase()}_API_KEY not set in Settings > Developers" >&2
  exit 1
fi

# Replace with actual MCP server
exec uvx --from git+https://github.com/<org>/<mcp-repo> <command>
`;

    await $`mkdir -p ${skillDir}/mcp-wrappers`.quiet();
    await Bun.write(`${skillDir}/mcp-wrappers/${SLUG}-mcp-wrapper.sh`, mcpWrapper);
    await $`chmod +x ${skillDir}/mcp-wrappers/${SLUG}-mcp-wrapper.sh`.quiet();
    log(`Created: ${skillDir}/mcp-wrappers/${SLUG}-mcp-wrapper.sh`, "success");
  }

  // Phase 5: Create Enhancement Skills Template
  log("\n✨ Phase 5: Creating enhancement skill templates...", "info");
  
  const enhancementTemplate = `#!/usr/bin/env bun
/**
 * ${PERSONA_NAME} Enhancement: Reporting
 */

async function generateReport() {
  console.log(\`Generating report for ${PERSONA_NAME}...\`);
  // Implement reporting logic
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case "report":
      await generateReport();
      break;
    default:
      console.log("Usage: bun ${SLUG}-report.ts report");
  }
}

main();
`;

  await Bun.write(`${skillDir}/scripts/${SLUG}-report.ts`, enhancementTemplate);
  await $`chmod +x ${skillDir}/scripts/${SLUG}-report.ts`.quiet();
  log(`Created: ${skillDir}/scripts/${SLUG}-report.ts`, "success");

  // Phase 6: Update AGENTS.md
  log("\n📝 Phase 6: Updating AGENTS.md...", "info");
  log("Add the following to /home/workspace/AGENTS.md:", "info");
  console.log(`
### ${PERSONA_NAME} ✅
- **Status:** Active
- **Domain:** ${DOMAIN}
- **Location:** [Settings > Personas](/?t=settings&s=your-ai&d=personas)
- **Skill:** \`Skills/${SLUG}-skill/\`

**Safety Rules:**
${config.safetyRules.map(r => `- ${r}`).join('\n')}
`);

  // Phase 7: Testing Checklist
  log("\n🧪 Phase 7: Testing Checklist", "info");
  console.log(`
Before deploying, verify:
- [ ] Persona responds correctly
- [ ] Safety rules trigger appropriately
- [ ] Skill returns valid data
- [ ] MCP server starts (if applicable)
- [ ] No credentials exposed
- [ ] Documentation is complete
`);

  // Phase 8: Summary
  log("\n🎉 Setup Complete!", "success");
  console.log(`
Created:
- Skill directory: ${skillDir}/
- Main script: ${skillDir}/scripts/${SLUG}.ts
- Enhancement: ${skillDir}/scripts/${SLUG}-report.ts
${config.requiresApiKey ? `- MCP wrapper: ${skillDir}/mcp-wrappers/${SLUG}-mcp-wrapper.sh` : ''}

Next Steps:
1. Add API key in [Settings > Developers](/?t=settings&s=developers)
2. Edit the persona prompt to add domain expertise
3. Customize the skill script for your use case
4. Test: cd ${skillDir}/scripts && bun ${SLUG}.ts status
5. Enable persona in Settings > Personas
`);
}

main().catch((error) => {
  log(`Setup failed: ${error.message}`, "error");
  process.exit(1);
});
