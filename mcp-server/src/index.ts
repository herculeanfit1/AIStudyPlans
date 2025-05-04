import express from 'express';
import { config } from 'dotenv';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { Server as HttpServer } from 'http';
import EventEmitter from 'events';

import { logger } from './utils/logger';
import { 
  configureCors, 
  errorHandler, 
  requestLogger, 
  requestTimer,
  secureHeaders 
} from './utils/securityMiddleware';
import { generateCode, generateCodeSchema } from './tools/generateCode';

// Load environment variables
config();

// Validate critical environment variables
const requiredEnvVars = ['OPENAI_BASE_URL', 'OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  logger.error({ missingEnvVars }, 'Missing required environment variables');
  process.exit(1);
}

// Initialize OpenAI-compatible client
const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY
});

// Create Express app
const app = express();
const port = parseInt(process.env.PORT || '3333', 10);

// Apply security middleware
app.use(requestTimer);
app.use(secureHeaders);
app.use(configureCors());
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

// Health check endpoint (does not expose version details for security)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Simple MCP SSE implementation
app.get('/mcp/events', (req, res) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Log connection
  logger.info({ 
    requestId, 
    type: 'mcp-sse-connection' 
  }, 'Client connected to SSE');
  
  // Handle client disconnect
  req.on('close', () => {
    logger.info({ requestId }, 'Client disconnected from SSE');
  });
  
  // Send initial connection established message
  res.write(`data: ${JSON.stringify({ type: 'connected', requestId })}\n\n`);
});

// MCP tool endpoint - generate_code
app.post('/mcp/tools/generate_code', async (req, res) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  
  try {
    // Validate input
    const params = req.body;
    
    // Call the generate code function
    const generatedCode = await generateCode(params, openai, { requestId });
    
    // Return the result
    res.status(200).json({ result: generatedCode });
  } catch (error) {
    logger.error({ 
      requestId, 
      error: error instanceof Error ? error.message : String(error) 
    }, 'Error in generate_code endpoint');
    
    res.status(400).json({ 
      error: 'Invalid parameters or server error',
      requestId 
    });
  }
});

// Tools discovery endpoint
app.get('/mcp/tools', (_req, res) => {
  res.status(200).json({
    tools: [
      {
        name: 'generate_code',
        description: 'Generates code based on natural language instructions',
        parameters: generateCodeSchema
      }
    ]
  });
});

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  logger.info({ port }, 'MCP server started');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Catch unhandled exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.fatal({ error: error.stack }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled rejection');
  process.exit(1);
});

export default server; 