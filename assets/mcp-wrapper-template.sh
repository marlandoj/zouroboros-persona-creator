#!/bin/bash
# MCP Server Wrapper for {{PERSONA_NAME}}
# 
# This wrapper sets up the environment for running an MCP server on Zo Computer.
# It handles API key validation and environment configuration.
#
# Usage: ./{{SLUG}}-mcp-wrapper.sh

set -e

# Configuration
export PATH="$HOME/.local/bin:$PATH"
export {{API_KEY_NAME}}="${{API_KEY_NAME}}"

# Validate API key
if [ -z "${{API_KEY_NAME}}" ]; then
    echo "❌ Error: {{API_KEY_NAME}} not set" >&2
    echo "" >&2
    echo "Please add your API key in Settings > Developers" >&2
    echo "Variable name: {{API_KEY_NAME}}" >&2
    exit 1
fi

# Validate uvx is available
if ! command -v uvx &> /dev/null; then
    echo "❌ Error: uvx not found" >&2
    echo "" >&2
    echo "Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh" >&2
    exit 1
fi

# Log startup (to stderr so it doesn't interfere with MCP protocol)
echo "🚀 Starting {{PERSONA_NAME}} MCP server..." >&2
echo "✅ API key configured" >&2

# Start MCP server
# Replace with actual MCP server command:
# exec uvx --from git+https://github.com/<org>/<repo> <command> "$API_KEY"
echo "⚠️  MCP server not yet configured" >&2
echo "Edit this file and replace the exec line with your MCP server command" >&2
exit 1
