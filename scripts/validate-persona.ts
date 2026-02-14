#!/usr/bin/env bun
/**
 * Persona Validation Script
 * 
 * Validates that a persona setup is complete and working.
 * 
 * Usage: bun validate-persona.ts <persona-slug>
 * Example: bun validate-persona.ts health-coach
 */

import { $ } from "bun";

const SLUG = process.argv[2];

if (!SLUG) {
  console.log("Usage: bun validate-persona.ts <persona-slug>");
  console.log("Example: bun validate-persona.ts health-coach");
  process.exit(1);
}

interface ValidationResult {
  category: string;
  checks: {
    name: string;
    status: "pass" | "fail" | "warn" | "skip";
    message: string;
  }[];
}

const results: ValidationResult[] = [];

function log(message: string, type: "info" | "success" | "warning" | "error" = "info") {
  const icons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
  console.log(`${icons[type]} ${message}`);
}

async function validateStructure(): Promise<ValidationResult> {
  const checks = [];
  const skillDir = `/home/workspace/Skills/${SLUG}-skill`;

  // Check skill directory exists
  const dirExists = await Bun.file(skillDir).exists() || 
    await $`test -d ${skillDir}`.quiet().then(() => true).catch(() => false);
  checks.push({
    name: "Skill directory exists",
    status: dirExists ? "pass" : "fail",
    message: dirExists ? `${skillDir}` : `Missing: ${skillDir}`
  });

  if (dirExists) {
    // Check SKILL.md
    const skillMdExists = await Bun.file(`${skillDir}/SKILL.md`).exists();
    checks.push({
      name: "SKILL.md exists",
      status: skillMdExists ? "pass" : "warn",
      message: skillMdExists ? "Found" : "Missing documentation"
    });

    // Check scripts directory
    const scriptsDirExists = await $`test -d ${skillDir}/scripts`.quiet().then(() => true).catch(() => false);
    checks.push({
      name: "Scripts directory exists",
      status: scriptsDirExists ? "pass" : "fail",
      message: scriptsDirExists ? "Found" : "Missing scripts/"
    });

    // Check main script
    if (scriptsDirExists) {
      const mainScript = `${skillDir}/scripts/${SLUG}.ts`;
      const scriptExists = await Bun.file(mainScript).exists();
      checks.push({
        name: "Main script exists",
        status: scriptExists ? "pass" : "fail",
        message: scriptExists ? mainScript : `Missing: ${mainScript}`
      });

      if (scriptExists) {
        // Check script is executable
        const isExecutable = await $`test -x ${mainScript}`.quiet().then(() => true).catch(() => false);
        checks.push({
          name: "Script is executable",
          status: isExecutable ? "pass" : "warn",
          message: isExecutable ? "Yes" : "Run: chmod +x " + mainScript
        });
      }
    }

    // Check assets directory
    const assetsDirExists = await $`test -d ${skillDir}/assets`.quiet().then(() => true).catch(() => false);
    checks.push({
      name: "Assets directory exists",
      status: assetsDirExists ? "pass" : "warn",
      message: assetsDirExists ? "Found" : "Consider adding assets/"
    });
  }

  return { category: "📁 Structure", checks };
}

async function validateConfiguration(): Promise<ValidationResult> {
  const checks = [];
  const skillDir = `/home/workspace/Skills/${SLUG}-skill`;

  // Check if script reads API key from env
  const mainScript = `${skillDir}/scripts/${SLUG}.ts`;
  const scriptExists = await Bun.file(mainScript).exists();
  
  if (scriptExists) {
    const content = await Bun.file(mainScript).text();
    const usesEnvVar = content.includes("process.env");
    checks.push({
      name: "Uses environment variables",
      status: usesEnvVar ? "pass" : "warn",
      message: usesEnvVar ? "Good - no hardcoded keys" : "Should use process.env for API keys"
    });

    const hasErrorHandling = content.includes("try {") || content.includes("catch");
    checks.push({
      name: "Has error handling",
      status: hasErrorHandling ? "pass" : "warn",
      message: hasErrorHandling ? "Good" : "Consider adding try/catch"
    });
  }

  // Check for AGENTS.md reference
  const agentsMdExists = await Bun.file("/home/workspace/AGENTS.md").exists();
  if (agentsMdExists) {
    const agentsContent = await Bun.file("/home/workspace/AGENTS.md").text();
    const referenced = agentsContent.includes(SLUG);
    checks.push({
      name: "Referenced in AGENTS.md",
      status: referenced ? "pass" : "warn",
      message: referenced ? "Found" : "Add to AGENTS.md for tracking"
    });
  }

  return { category: "⚙️ Configuration", checks };
}

async function validateFunctionality(): Promise<ValidationResult> {
  const checks = [];
  const skillDir = `/home/workspace/Skills/${SLUG}-skill`;
  const mainScript = `${skillDir}/scripts/${SLUG}.ts`;

  const scriptExists = await Bun.file(mainScript).exists();
  if (!scriptExists) {
    checks.push({
      name: "Can run tests",
      status: "skip",
      message: "Main script not found"
    });
    return { category: "🧪 Functionality", checks };
  }

  // Test help command
  try {
    const helpOutput = await $`bun ${mainScript} help`.quiet().text();
    const hasHelp = helpOutput.includes("Usage:") || helpOutput.includes("Commands:");
    checks.push({
      name: "Help command works",
      status: hasHelp ? "pass" : "warn",
      message: hasHelp ? "Help available" : "Consider adding help"
    });
  } catch {
    checks.push({
      name: "Help command works",
      status: "fail",
      message: "Script failed to run"
    });
  }

  // Test status command
  try {
    const statusOutput = await $`bun ${mainScript} status`.quiet().text();
    checks.push({
      name: "Status command works",
      status: "pass",
      message: "Responds to status"
    });
  } catch (error: any) {
    const errorMsg = error.stderr?.toString() || error.message || "";
    const apiKeyMissing = errorMsg.includes("API_KEY") || errorMsg.includes("not set");
    checks.push({
      name: "Status command works",
      status: apiKeyMissing ? "warn" : "fail",
      message: apiKeyMissing ? "API key needed in Settings > Developers" : "Error running status"
    });
  }

  return { category: "🧪 Functionality", checks };
}

async function validateDocumentation(): Promise<ValidationResult> {
  const checks = [];
  const skillDir = `/home/workspace/Skills/${SLUG}-skill`;

  // Check SKILL.md content
  const skillMdPath = `${skillDir}/SKILL.md`;
  const skillMdExists = await Bun.file(skillMdPath).exists();
  
  if (skillMdExists) {
    const content = await Bun.file(skillMdPath).text();
    
    const hasUsage = content.includes("Usage:") || content.includes("## Usage");
    checks.push({
      name: "Has usage section",
      status: hasUsage ? "pass" : "warn",
      message: hasUsage ? "Found" : "Add usage examples"
    });

    const hasDescription = content.includes("description:");
    checks.push({
      name: "Has frontmatter description",
      status: hasDescription ? "pass" : "warn",
      message: hasDescription ? "Found" : "Add YAML frontmatter"
    });
  }

  // Check for README or references
  const referencesDir = `${skillDir}/references`;
  const hasReferences = await $`test -d ${referencesDir}`.quiet().then(() => true).catch(() => false);
  checks.push({
    name: "Has references directory",
    status: hasReferences ? "pass" : "skip",
    message: hasReferences ? "Found" : "Optional"
  });

  return { category: "📝 Documentation", checks };
}

function printResults(): void {
  console.log("\n" + "=".repeat(60));
  console.log("VALIDATION RESULTS");
  console.log("=".repeat(60));

  let totalChecks = 0;
  let passed = 0;
  let warnings = 0;
  let failed = 0;

  for (const category of results) {
    console.log(`\n${category.category}`);
    console.log("-".repeat(40));

    for (const check of category.checks) {
      totalChecks++;
      const icon = check.status === "pass" ? "✅" : 
                   check.status === "warn" ? "⚠️" : 
                   check.status === "skip" ? "⏭️" : "❌";
      
      console.log(`${icon} ${check.name}`);
      console.log(`   ${check.message}`);

      if (check.status === "pass") passed++;
      else if (check.status === "warn") warnings++;
      else if (check.status === "fail") failed++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`Summary: ${passed} passed, ${warnings} warnings, ${failed} failed`);
  console.log("=".repeat(60));

  if (failed > 0) {
    console.log("\n❌ Validation failed. Please fix the issues above.");
    process.exit(1);
  } else if (warnings > 0) {
    console.log("\n⚠️  Validation passed with warnings. Review suggestions above.");
    process.exit(0);
  } else {
    console.log("\n✅ All checks passed!");
    process.exit(0);
  }
}

async function main(): Promise<void> {
  log(`Validating persona: ${SLUG}`, "info");
  console.log();

  results.push(await validateStructure());
  results.push(await validateConfiguration());
  results.push(await validateFunctionality());
  results.push(await validateDocumentation());

  printResults();
}

main().catch((error) => {
  log(`Validation failed: ${error.message}`, "error");
  process.exit(1);
});
