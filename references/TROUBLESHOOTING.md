# Troubleshooting Guide

Common issues and solutions when creating personas.

---

## Setup Issues

### "bun: command not found"

**Cause:** Bun not installed

**Solutions:**
1. Install Bun:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   source ~/.bashrc
   ```

2. Or use npm/node as fallback:
   ```bash
   # Replace 'bun' with 'npx ts-node' in scripts
   ```

### "uvx: command not found"

**Cause:** uv not installed (needed for MCP servers)

**Solution:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
```

### "Permission denied" when running script

**Cause:** Script not executable

**Solution:**
```bash
chmod +x scripts/*.ts
chmod +x mcp-wrappers/*.sh
```

### "API key required" error

**Cause:** Environment variable not set

**Solutions:**
1. Add key in [Settings > Developers](/?t=settings&s=developers)
2. Verify key name matches exactly (case-sensitive)
3. Restart terminal/session after adding
4. Test: `echo $YOUR_API_KEY`

---

## Persona Issues

### Persona responds incorrectly

**Symptoms:** Wrong tone, wrong expertise, ignores rules

**Solutions:**
1. Review and update persona prompt
2. Check prompt includes clear role definition
3. Add explicit response guidelines
4. Test with specific queries

### Safety rules not triggering

**Symptoms:** Actions proceed without confirmation

**Solutions:**
1. Verify rules are active: `list_rules`
2. Check condition matches action exactly
3. Test with explicit trigger phrase
4. Rule may need more specific condition

### Rules too restrictive

**Symptoms:** Blocks valid use cases

**Solutions:**
1. Broaden condition to be less specific
2. Add exceptions to instruction
3. Use OR logic in condition
4. Separate into multiple rules

---

## Skill Issues

### "Cannot find module"

**Cause:** Import statement or file path issue

**Solutions:**
1. Use relative paths: `./file.ts`
2. Check file exists: `ls scripts/`
3. Verify Bun version: `bun --version`
4. Use built-in APIs instead of external deps

### "API error: 401"

**Cause:** Authentication failed

**Solutions:**
1. Check API key is correct
2. Verify key has required permissions
3. Check key not expired
4. Try regenerating key

### "API error: 429"

**Cause:** Rate limit exceeded

**Solutions:**
1. Add delays between requests
2. Implement exponential backoff
3. Check API tier limits
4. Consider upgrading plan

### "API error: 404"

**Cause:** Endpoint or resource not found

**Solutions:**
1. Verify API URL is correct
2. Check endpoint path
3. Ensure resource ID exists
4. Review API documentation

---

## MCP Server Issues

### "Error: MCP_API_KEY not set"

**Cause:** Wrapper script can't find API key

**Solutions:**
1. Add key in Settings > Developers
2. Restart terminal after adding
3. Check key name in wrapper matches
4. Export key manually: `export MCP_API_KEY=xxx`

### "Package not found" or "No such file"

**Cause:** MCP server repository issue

**Solutions:**
1. Verify repository URL is correct
2. Check repo exists and is public
3. Try specific version/tag
4. Use alternative MCP server

### "Connection refused" or timeout

**Cause:** MCP server not starting properly

**Solutions:**
1. Test MCP independently:
   ```bash
   uvx --from <repo> <command> --help
   ```
2. Check for port conflicts
3. Verify API key valid
4. Check firewall/network

### MCP server runs but persona doesn't use it

**Cause:** Persona prompt doesn't reference MCP

**Solutions:**
1. Update persona prompt to mention MCP
2. Include MCP capability in prompt
3. Test with explicit MCP query
4. Verify MCP server name in prompt

---

## Integration Issues

### Skills and MCP use different data

**Cause:** Not sharing data sources

**Solutions:**
1. Use same API keys for both
2. Document data flow
3. Add data synchronization
4. Prefer one source for consistency

### Persona doesn't know about skills

**Cause:** Prompt doesn't mention tools

**Solutions:**
1. Add skills section to persona prompt
2. List available commands
3. Include usage examples
4. Reference AGENTS.md

### AGENTS.md out of sync

**Cause:** Documentation not updated

**Solutions:**
1. Update after each change
2. Include in deployment checklist
3. Automate with setup script
4. Review monthly

---

## Performance Issues

### Slow response times

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Large data requests | Add pagination |
| Synchronous calls | Use async/await |
| Inefficient algorithms | Optimize code |
| Slow API responses | Add caching |

### High memory usage

**Solutions:**
1. Stream large responses
2. Process data in chunks
3. Clear unused variables
4. Use generators for iteration

### Script crashes on large data

**Solutions:**
1. Add try/catch blocks
2. Validate data before processing
3. Set maximum limits
4. Log errors for debugging

---

## Security Issues

### Credentials exposed in logs

**Cause:** Logging sensitive data

**Solutions:**
1. Never log API keys
2. Mask sensitive data in output
3. Use environment variables only
4. Audit log statements

### Unauthorized access

**Cause:** Weak or exposed API keys

**Solutions:**
1. Rotate keys regularly
2. Use read-only keys where possible
3. Limit key permissions
4. Monitor API usage

### Data leakage between users

**Cause:** Shared state or cache

**Solutions:**
1. Use isolated environments
2. Clear cache between sessions
3. Don't persist user data
4. Implement access controls

---

## Debugging Tips

### Enable verbose logging

```typescript
// Add to scripts
const DEBUG = process.env.DEBUG === "true";

function log(...args: any[]) {
  if (DEBUG) console.log("[DEBUG]", ...args);
}
```

Run with: `DEBUG=true bun script.ts`

### Test API independently

```bash
# Before using in skill, test API:
curl -H "Authorization: Bearer $API_KEY" \
  https://api.example.com/endpoint
```

### Check environment

```bash
# Verify setup
which bun
which uvx
echo $PATH
env | grep API_KEY
```

### Isolate components

Test each component separately:
1. Test skill alone
2. Test MCP alone
3. Test persona alone
4. Combine gradually

---

## Getting Unstuck

### Start simple
1. Create minimal working version
2. Add features incrementally
3. Test after each change
4. Commit working versions

### Use working examples
1. Copy from `examples/`
2. Modify gradually
3. Test at each step
4. Compare if issues arise

### Reset and retry
1. Document current state
2. Delete and recreate
3. Follow manual guide
4. Identify where it breaks

### Ask for help
When stuck:
1. Check this troubleshooting guide
2. Review SKILL.md best practices
3. Test components individually
4. Document issue and solution

---

## Prevention Checklist

Before deployment, verify:

- [ ] All API keys use environment variables
- [ ] No credentials in code or logs
- [ ] Rate limits documented and handled
- [ ] Errors caught and logged
- [ ] Safety rules tested
- [ ] Documentation complete
- [ ] Rollback plan ready
- [ ] Monitoring in place