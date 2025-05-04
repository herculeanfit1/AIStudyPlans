import pino from 'pino';

/**
 * Centralized logger configuration for secure, structured logging
 * Supports redaction of sensitive data and standardized log format
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'params.content',
      'params.instruction', 
      '*.password', 
      '*.apiKey', 
      '*.token',
      '*.secretKey'
    ],
    censor: '[REDACTED]'
  },
  timestamp: true,
  base: {
    env: process.env.NODE_ENV || 'development',
    service: 'mcp-server'
  },
  formatters: {
    level: (label) => {
      return { level: label };
    }
  },
  serializers: {
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  }
});

/**
 * Creates a child logger with request context
 * @param requestId Unique identifier for the request
 * @param userId Optional user identifier
 */
export function createRequestLogger(requestId: string, userId?: string) {
  return logger.child({ 
    requestId, 
    userId: userId || 'anonymous' 
  });
} 