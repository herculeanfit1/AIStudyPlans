# Secure MCP Server for Qwen3 Coder

This is a secure implementation of a Model Context Protocol (MCP) server that connects Cursor with a local Qwen3 Coder model, enabling tool access without requiring cloud-hosted models.

## Security Features

- **Server-Sent Events (SSE) over HTTPS**: Secure transport layer with pre-connection authentication
- **JSON Schema Validation**: All tool inputs are validated using strict schemas
- **Comprehensive Logging**: Structured, redacted logs for audit trails and monitoring
- **CORS Protection**: Strict origin controls to prevent cross-site attacks
- **Defense-in-Depth**: Multiple security layers from application to infrastructure
- **Least Privilege**: Non-root Docker container with minimal permissions
- **Input Sanitization**: Protection against injection attacks
- **Secure Headers**: HTTP headers hardened with Helmet

## Implementation Notes

This server implements a simplified version of the MCP protocol to allow Cursor to communicate with your local LLM. The key components are:

- **MCP Integration**: Allows Cursor to discover and invoke tools through your local model
- **Tool Schema Validation**: Ensures all inputs are properly sanitized and validated
- **Express Server**: Lightweight HTTP server handling MCP protocol requests
- **OpenAI-compatible Client**: Connects to your local Qwen3 model running at http://10.1.10.98:1234/v1

The current implementation focuses on exposing the `generate_code` tool, but additional tools can be added by following the same pattern:

1. Define schema and type in `/src/types.ts`
2. Create tool implementation in `/src/tools/`
3. Register the tool in the `/src/index.ts` file

## Prerequisites

- Node.js 18+
- A running Qwen3 Coder model (e.g., via LM Studio) at http://10.1.10.98:1234/v1

## Setup

1. Install dependencies:

```bash
cd mcp-server
npm ci
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

The server will run on port 3333 by default.

## Configuration

The server requires the following environment variables:

- `OPENAI_BASE_URL`: URL of your local LLM endpoint (default: "http://10.1.10.98:1234/v1")
- `OPENAI_API_KEY`: API key for your local LLM (default: "local-test")
- `PORT`: Port to run the MCP server on (default: 3333)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (default: "http://localhost:3000")
- `LOG_LEVEL`: Logging level (default: "info")

## Docker Deployment

For production deployment, use the included Dockerfile:

```bash
docker build -t mcp-server .
docker run -p 3333:3333 -e OPENAI_BASE_URL=http://host.docker.internal:1234/v1 -e OPENAI_API_KEY=local-test mcp-server
```

## Available Tools

The following tools are available through this MCP server:

### generate_code

Generates code based on natural language instructions.

Parameters:
- `language`: The programming language to generate code in
- `instruction`: The description of what code to generate
- `context`: (Optional) Additional context for code generation

## Security Best Practices

1. **Environment Isolation**: Run the MCP server on a private network
2. **Regular Updates**: Keep dependencies up-to-date with `npm audit`
3. **Access Control**: Restrict who can connect to the MCP server
4. **Monitoring**: Set up alerts for suspicious activity patterns
5. **Secret Management**: Use a secrets manager or environment variables for configuration

## License

This project is proprietary and confidential. 