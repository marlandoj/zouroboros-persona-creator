#!/usr/bin/env bun
/**
 * {{SKILL_NAME}} Skill Script
 * 
 * Usage: bun {{SLUG}}.ts <command> [options]
 * 
 * Environment:
 *   {{API_KEY_NAME}} - API key from Settings > Developers
 */

const API_KEY = process.env.{{API_KEY_NAME}};
const BASE_URL = "{{API_BASE_URL}}";

// Types
interface ApiResponse {
  // Define your response type
  success: boolean;
  data?: any;
  error?: string;
}

// API Client
async function apiRequest(endpoint: string, options?: RequestInit): Promise<ApiResponse> {
  if (!API_KEY) {
    throw new Error(`{{API_KEY_NAME}} not set. Add it in Settings > Developers.`);
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Commands
async function checkStatus(): Promise<void> {
  console.log("🔍 Checking {{SKILL_NAME}} status...\n");
  
  const checks = {
    apiKey: !!API_KEY,
    apiConnection: false,
  };

  try {
    // Test API connection
    await apiRequest("/status");
    checks.apiConnection = true;
  } catch (error: any) {
    checks.apiConnection = false;
  }

  // Report
  console.log(`API Key:      ${checks.apiKey ? "✅ Configured" : "❌ Missing"}`);
  console.log(`API Connection: ${checks.apiConnection ? "✅ Connected" : "❌ Failed"}`);
  
  if (!checks.apiKey) {
    console.log("\n⚠️  Add your API key in Settings > Developers");
    console.log(`   Variable name: {{API_KEY_NAME}}`);
    process.exit(1);
  }
}

async function searchItems(query: string): Promise<void> {
  if (!query) {
    console.error("Usage: bun {{SLUG}}.ts search <query>");
    process.exit(1);
  }

  console.log(`🔍 Searching for: ${query}\n`);
  
  try {
    const result = await apiRequest(`/search?q=${encodeURIComponent(query)}`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error(`❌ Search failed: ${error.message}`);
    process.exit(1);
  }
}

async function getItem(id: string): Promise<void> {
  if (!id) {
    console.error("Usage: bun {{SLUG}}.ts get <id>");
    process.exit(1);
  }

  console.log(`📋 Fetching item: ${id}\n`);
  
  try {
    const result = await apiRequest(`/items/${id}`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error(`❌ Failed to fetch item: ${error.message}`);
    process.exit(1);
  }
}

async function listItems(): Promise<void> {
  console.log("📋 Listing items...\n");
  
  try {
    const result = await apiRequest("/items");
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error(`❌ Failed to list items: ${error.message}`);
    process.exit(1);
  }
}

// Help
function showHelp(): void {
  console.log(`
{{SKILL_NAME}} Skill

Usage: bun {{SLUG}}.ts <command> [options]

Commands:
  status           Check API connection and configuration
  search <query>   Search for items
  get <id>         Get specific item by ID
  list             List all items
  help             Show this help message

Environment Variables:
  {{API_KEY_NAME}}    Required. Get from Settings > Developers

Examples:
  bun {{SLUG}}.ts status
  bun {{SLUG}}.ts search "example query"
  bun {{SLUG}}.ts get item-123
  bun {{SLUG}}.ts list
`);
}

// Main
async function main(): Promise<void> {
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case "status":
      await checkStatus();
      break;
    case "search":
      await searchItems(arg || "");
      break;
    case "get":
      await getItem(arg || "");
      break;
    case "list":
      await listItems();
      break;
    case "help":
    case undefined:
      showHelp();
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(`❌ Unexpected error: ${error.message}`);
  process.exit(1);
});
