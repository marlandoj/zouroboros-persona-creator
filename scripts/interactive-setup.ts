#!/usr/bin/env bun
/**
 * Interactive Persona Setup
 * 
 * Walks through creating a complete persona with guided prompts.
 * 
 * Usage: bun interactive-setup.ts
 */

import { $ } from "bun";

interface PersonaConfig {
  name: string;
  slug: string;
  domain: string;
  expertise: string[];
  description: string;
  requiresApiKey: boolean;
  apiKeyName: string;
  apiBaseUrl: string;
  safetyRules: string[];
  capabilities: string[];
}

function log(message: string, type: "info" | "success" | "warning" | "error" = "info") {
  const icons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
  console.log(`${icons[type]} ${message}`);
}

function question(prompt: string): Promise<string> {
  process.stdout.write(`${prompt}: `);
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function confirm(prompt: string): Promise<boolean> {
  const answer = await question(`${prompt} (y/n)`);
  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

async function collectConfig(): Promise<PersonaConfig> {
  console.log("\n🎭 Interactive Persona Setup\n");
  console.log("Answer the following questions to create your persona.\n");

  const name = await question("Persona name (e.g., 'Health Coach')");
  if (!name) {
    throw new Error("Persona name is required");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  log(`Generated slug: ${slug}`, "info");

  const domain = await question("Domain (e.g., healthcare, financial, legal, creative)") || "general";
  
  console.log("\nEnter 3 areas of expertise (press Enter to skip remaining):");
  const expertise: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const exp = await question(`  Expertise ${i}`);
    if (exp) expertise.push(exp);
  }

  const description = await question("Short description of what this persona does") || 
    `${name} - ${domain} assistant`;

  const requiresApiKey = await confirm("Does this persona need an API key?");
  
  let apiKeyName = "";
  let apiBaseUrl = "";
  
  if (requiresApiKey) {
    apiKeyName = await question(`API key environment variable name (e.g., ${domain.toUpperCase()}_API_KEY)`) || 
      `${domain.toUpperCase()}_API_KEY`;
    apiBaseUrl = await question("API base URL (e.g., https://api.example.com/v1)") || 
      `https://api.${domain}.com/v1`;
  }

  console.log("\nSelect safety rules to include:");
  const availableRules = [
    "Always verify information before providing recommendations",
    "Include disclaimers for all advice",
    "Require explicit confirmation before taking actions",
    "Respect user privacy and data security",
    "Stay within defined expertise scope",
  ];

  const safetyRules: string[] = [];
  for (const rule of availableRules) {
    if (await confirm(`  Include: "${rule}"`)) {
      safetyRules.push(rule);
    }
  }

  console.log("\nSelect capabilities:");
  const availableCapabilities = [
    "Access real-time data via MCP",
    "Execute actions on user's behalf",
    "Generate reports and summaries",
    "Send proactive alerts",
    "Analyze data and provide insights",
  ];

  const capabilities: string[] = [];
  for (const cap of availableCapabilities) {
    if (await confirm(`  Include: ${cap}`)) {
      capabilities.push(cap);
    }
  }

  return {
    name,
    slug,
    domain,
    expertise,
    description,
    requiresApiKey,
    apiKeyName,
    apiBaseUrl,
    safetyRules,
    capabilities,
  };
}

async function createSkillDirectory(config: PersonaConfig): Promise<void> {
  log("\n📁 Creating skill directory...", "info");

  const skillDir = `/home/workspace/Skills/${config.slug}-skill`;
  
  await $`mkdir -p ${skillDir}/{scripts,assets,references}`.quiet();
  log(`Created: ${skillDir}`, "success");

  // Create SKILL.md
  const skillMd = `---
name: ${config.slug}-skill
description: ${config.description}
compatibility: Created for Zo Computer
metadata:
  author: zo.computer
  created: ${new Date().toISOString().split("T")[0]}
  version: 1.0.0
---

# ${config.name} Skill

${config.description}

## Quick Start

\`\`\`bash
cd Skills/${config.slug}-skill/scripts
bun ${config.slug}.ts status
bun ${config.slug}.ts --help
\`\`\`

## Capabilities

${config.capabilities.map(c => `- ${c}`).join("\n")}

## API Keys

${config.requiresApiKey 
  ? `Required environment variable:\n- \`${config.apiKeyName}\` - Add in Settings > Developers`
  : "No API key required."}

## Safety Rules

${config.safetyRules.map(r => `- ${r}`).join("\n")}

## Usage

\`\`\`bash
# Check status
bun ${config.slug}.ts status

# Get help
bun ${config.slug}.ts --help
\`\`\`

## Files

- \`scripts/${config.slug}.ts\` - Main skill script
- \`assets/prompt.md\` - Persona prompt template
- \`references/\` - Documentation
`;

  await Bun.write(`${skillDir}/SKILL.md`, skillMd);
  log(`Created: ${skillDir}/SKILL.md`, "success");
}

async function createSkillScript(config: PersonaConfig): Promise<void> {
  log("\n🔧 Creating skill script...", "info");

  const skillDir = `/home/workspace/Skills/${config.slug}-skill`;
  const scriptPath = `${skillDir}/scripts/${config.slug}.ts`;

  // Read template
  const templatePath = "/home/workspace/Skills/persona-creation-template-skill/assets/skill-template.ts";
  let template = await Bun.file(templatePath).text();

  // Replace placeholders
  template = template
    .replace(/\{\{SKILL_NAME\}\}/g, config.name)
    .replace(/\{\{SLUG\}\}/g, config.slug)
    .replace(/\{\{API_KEY_NAME\}\}/g, config.apiKeyName)
    .replace(/\{\{API_BASE_URL\}\}/g, config.apiBaseUrl);

  await Bun.write(scriptPath, template);
  await $`chmod +x ${scriptPath}`.quiet();
  log(`Created: ${scriptPath}`, "success");

  // Create enhancement script
  const enhancementScript = `#!/usr/bin/env bun
/**
 * ${config.name} Enhancement: Reporting
 */

async function generateReport() {
  console.log(\`📝 Generating ${config.name} report...\`);
  console.log("Report generation not yet implemented.");
  console.log("Customize this script for your reporting needs.");
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case "report":
      await generateReport();
      break;
    default:
      console.log(\`
${config.name} Report Enhancement

Usage: bun ${config.slug}-report.ts <command>

Commands:
  report    Generate a report
\`);
  }
}

main();
`;

  const enhancementPath = `${skillDir}/scripts/${config.slug}-report.ts`;
  await Bun.write(enhancementPath, enhancementScript);
  await $`chmod +x ${enhancementPath}`.quiet();
  log(`Created: ${enhancementPath}`, "success");
}

async function createPromptTemplate(config: PersonaConfig): Promise<void> {
  log("\n📝 Creating persona prompt template...", "info");

  const skillDir = `/home/workspace/Skills/${config.slug}-skill`;
  
  const prompt = `You are ${config.name}, an expert in ${config.domain}.

## Expertise

${config.expertise.map(e => `- ${e}`).join("\n")}

## Core Capabilities

${config.capabilities.map(c => `- ${c}`).join("\n")}

## Safety & Compliance

${config.safetyRules.map(r => `- ${r}`).join("\n")}

## Tools at Your Disposal

**Skills:**
- \`bun ${config.slug}.ts status\` - Check system status
- \`bun ${config.slug}.ts --help\` - Show help

## Response Guidelines

- Always be helpful and accurate
- Include relevant disclaimers when providing advice
- Ask for clarification when needed
- Stay within your defined expertise

## Tone & Style

- Professional yet approachable
- Clear and concise
- Focus on actionable insights
`;

  await Bun.write(`${skillDir}/assets/prompt.md`, prompt);
  log(`Created: ${skillDir}/assets/prompt.md`, "success");
}

async function printNextSteps(config: PersonaConfig): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("🎉 SETUP COMPLETE!");
  console.log("=".repeat(60));

  console.log(`
Created:
  📁 Skills/${config.slug}-skill/
  📄 SKILL.md
  🔧 scripts/${config.slug}.ts
  🔧 scripts/${config.slug}-report.ts
  📝 assets/prompt.md
`);

  console.log("Next Steps:");
  console.log(`  1. Add API key in Settings > Developers`);
  if (config.requiresApiKey) {
    console.log(`     Variable name: ${config.apiKeyName}`);
  }
  console.log(`  2. Create persona in Settings > Personas`);
  console.log(`     Copy prompt from: Skills/${config.slug}-skill/assets/prompt.md`);
  console.log(`  3. Create safety rules in Settings > Rules`);
  console.log(`  4. Test: cd Skills/${config.slug}-skill/scripts && bun ${config.slug}.ts status`);
  console.log(`  5. Validate: bun validate-persona.ts ${config.slug}`);
  console.log(`  6. Update AGENTS.md to track your persona`);

  console.log(`
Quick Commands:
  cd Skills/${config.slug}-skill/scripts
  bun ${config.slug}.ts status
  bun ${config.slug}.ts --help
`);
}

async function main(): Promise<void> {
  try {
    const config = await collectConfig();
    
    log("\n" + "=".repeat(60), "info");
    log("Creating persona with the following configuration:", "info");
    log(`  Name: ${config.name}`, "info");
    log(`  Domain: ${config.domain}`, "info");
    log(`  Slug: ${config.slug}`, "info");
    log(`  Expertise: ${config.expertise.join(", ") || "None specified"}`, "info");
    log(`  API Key: ${config.requiresApiKey ? config.apiKeyName : "Not required"}`, "info");
    log("=".repeat(60), "info");

    const proceed = await confirm("\nProceed with setup?");
    if (!proceed) {
      log("Setup cancelled.", "warning");
      process.exit(0);
    }

    await createSkillDirectory(config);
    await createSkillScript(config);
    await createPromptTemplate(config);
    await printNextSteps(config);

  } catch (error: any) {
    log(`Setup failed: ${error.message}`, "error");
    process.exit(1);
  }
}

main();
