#!/usr/bin/env bun
/**
 * SkillsMP API Client
 *
 * Search the SkillsMP marketplace for skills using keyword or AI semantic search.
 *
 * Usage: bun skillsmp.ts <command> [options]
 *
 * Environment:
 *   SKILLSMP_API_KEY - API key from https://skillsmp.com/docs/api
 */

const API_KEY = process.env.SKILLSMP_API_KEY;
const BASE_URL = "https://skillsmp.com/api/v1";

interface SkillsmpResponse {
  success: boolean;
  data?: any;
  error?: { code: string; message: string };
}

interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: "stars" | "recent";
}

async function apiRequest(endpoint: string): Promise<SkillsmpResponse> {
  if (!API_KEY) {
    throw new Error(
      "SKILLSMP_API_KEY not set.\n" +
        "  Get a free key at: https://skillsmp.com/docs/api\n" +
        "  Then add it in Settings > Developers as SKILLSMP_API_KEY"
    );
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const remaining = response.headers.get("X-RateLimit-Daily-Remaining");
  const limit = response.headers.get("X-RateLimit-Daily-Limit");

  if (!response.ok) {
    const body: SkillsmpResponse = await response.json().catch(() => ({
      success: false,
      error: { code: "UNKNOWN", message: `HTTP ${response.status}` },
    }));
    const code = body.error?.code || response.status;
    const msg = body.error?.message || "Request failed";
    throw new Error(`${code}: ${msg}`);
  }

  const data: SkillsmpResponse = await response.json();

  if (remaining && limit) {
    console.error(`[quota] ${remaining}/${limit} requests remaining today`);
  }

  return data;
}

// -- Commands -----------------------------------------------------------------

async function keywordSearch(query: string, opts: SearchOptions = {}): Promise<void> {
  if (!query) {
    console.error("Usage: bun skillsmp.ts search <query> [--page N] [--limit N] [--sort stars|recent]");
    process.exit(1);
  }

  const params = new URLSearchParams({ q: query });
  if (opts.page) params.set("page", String(opts.page));
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.sortBy) params.set("sortBy", opts.sortBy);

  console.log(`Searching SkillsMP for: "${query}"\n`);

  const result = await apiRequest(`/skills/search?${params}`);
  console.log(JSON.stringify(result, null, 2));
}

async function aiSearch(query: string): Promise<void> {
  if (!query) {
    console.error("Usage: bun skillsmp.ts ai-search <query>");
    process.exit(1);
  }

  const params = new URLSearchParams({ q: query });

  console.log(`AI search on SkillsMP for: "${query}"\n`);

  const result = await apiRequest(`/skills/ai-search?${params}`);
  console.log(JSON.stringify(result, null, 2));
}

async function checkStatus(): Promise<void> {
  console.log("Checking SkillsMP API status...\n");

  const checks = {
    apiKey: !!API_KEY,
    apiConnection: false,
  };

  if (checks.apiKey) {
    try {
      await apiRequest("/skills/search?q=test");
      checks.apiConnection = true;
    } catch (e: any) {
      if (e.message.includes("INVALID_API_KEY")) {
        console.log("API Key:        Set (but invalid)");
        console.log("API Connection: Failed - check your key");
        process.exit(1);
      }
      // Rate limit or other transient error still means the key works
      checks.apiConnection = true;
    }
  }

  console.log(`API Key:        ${checks.apiKey ? "Configured" : "Missing"}`);
  console.log(`API Connection: ${checks.apiConnection ? "Connected" : "Not tested (no key)"}`);
  console.log(`Base URL:       ${BASE_URL}`);
  console.log(`Rate Limit:     500 requests/day`);

  if (!checks.apiKey) {
    console.log("\nGet a free API key at: https://skillsmp.com/docs/api");
    console.log("Then add it in Settings > Developers as SKILLSMP_API_KEY");
    process.exit(1);
  }
}

// -- CLI parsing --------------------------------------------------------------

function parseArgs(): { command: string; query: string; opts: SearchOptions } {
  const args = process.argv.slice(2);
  const command = args[0] || "";

  const opts: SearchOptions = {};
  const queryParts: string[] = [];

  let i = 1;
  while (i < args.length) {
    if (args[i] === "--page" && args[i + 1]) {
      opts.page = parseInt(args[i + 1], 10);
      i += 2;
    } else if (args[i] === "--limit" && args[i + 1]) {
      opts.limit = parseInt(args[i + 1], 10);
      i += 2;
    } else if (args[i] === "--sort" && args[i + 1]) {
      opts.sortBy = args[i + 1] as "stars" | "recent";
      i += 2;
    } else {
      queryParts.push(args[i]);
      i++;
    }
  }

  return { command, query: queryParts.join(" "), opts };
}

function showHelp(): void {
  console.log(`
SkillsMP API Client

Usage: bun skillsmp.ts <command> [options]

Commands:
  search <query>       Keyword search for skills
  ai-search <query>    AI semantic search (Cloudflare AI)
  status               Check API key and connection
  help                 Show this help message

Search Options:
  --page <N>           Page number (default: 1)
  --limit <N>          Results per page (default: 20, max: 100)
  --sort <field>       Sort by: stars | recent

Environment:
  SKILLSMP_API_KEY     Required. Free key from https://skillsmp.com/docs/api

Examples:
  bun skillsmp.ts search "SEO"
  bun skillsmp.ts search "financial advisor" --sort stars --limit 10
  bun skillsmp.ts ai-search "How to create a web scraper"
  bun skillsmp.ts status

Rate Limit: 500 requests/day per API key (resets at midnight UTC)
`);
}

// -- Main ---------------------------------------------------------------------

async function main(): Promise<void> {
  const { command, query, opts } = parseArgs();

  switch (command) {
    case "search":
      await keywordSearch(query, opts);
      break;
    case "ai-search":
      await aiSearch(query);
      break;
    case "status":
      await checkStatus();
      break;
    case "help":
    case "":
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
