import { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';

/**
 * Configure CORS with strict origin controls
 */
export const configureCors = () => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);
  
  if (allowedOrigins.length === 0) {
    logger.warn('No CORS origins specified; defaulting to localhost:3000');
    allowedOrigins.push('http://localhost:3000');
  }
  
  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        logger.debug('Request with no origin allowed');
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        logger.debug({ origin }, 'Origin allowed by CORS policy');
        return callback(null, true);
      }
      
      logger.warn({ origin }, 'Origin rejected by CORS policy');
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
  });
};

/**
 * Centralized request ID generator and logger
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate or use provided request ID
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  res.setHeader('X-Request-ID', requestId);
  
  // Add context to request object
  req.requestId = requestId;
  
  // Log request details
  logger.info({
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  }, 'API request received');
  
  // Log response completion
  res.on('finish', () => {
    logger.info({
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: Date.now() - req.startTime
    }, 'API response sent');
  });
  
  next();
};

/**
 * Request start time tracker
 */
export const requestTimer = (req: Request, _res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
};

/**
 * Configure Helmet security headers
 */
export const secureHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
});

/**
 * Global error handler
 */
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error({
    requestId: req.requestId,
    error: {
      message: err.message,
      stack: err.stack
    },
    method: req.method,
    path: req.path
  }, 'Request error');
  
  res.status(500).json({
    error: 'Internal Server Error',
    requestId: req.requestId
  });
};

// Add request properties to Express Request interface
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
  }
} 