import { z } from 'zod';

/**
 * Common types for MCP server
 */

export const CodeGenerationSchema = z.object({
  language: z.string().min(1).max(50),
  instruction: z.string().min(1).max(5000),
  context: z.string().optional()
});

export type CodeGenerationParams = z.infer<typeof CodeGenerationSchema>;

export const FileOperationSchema = z.object({
  path: z.string().min(1).max(500).regex(/^[a-zA-Z0-9\/\._-]+$/),
  content: z.string().optional()
});

export type FileOperationParams = z.infer<typeof FileOperationSchema>;

export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  options: z.object({
    limit: z.number().min(1).max(100).optional(),
    filter: z.string().optional()
  }).optional()
});

export type SearchQueryParams = z.infer<typeof SearchQuerySchema>;

export interface LogContext {
  requestId: string;
  method: string;
  path: string;
  tool?: string;
  userId?: string;
}

export interface OpenAICompatibleService {
  chat: {
    completions: {
      create: (params: any) => Promise<any>;
    };
  };
} 