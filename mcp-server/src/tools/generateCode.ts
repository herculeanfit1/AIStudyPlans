import { z } from 'zod';
import { logger } from '../utils/logger';
import { CodeGenerationSchema, OpenAICompatibleService } from '../types';

export const generateCodeSchema = CodeGenerationSchema;

/**
 * Tool for generating code based on instructions
 */
export async function generateCode(
  params: z.infer<typeof generateCodeSchema>,
  model: OpenAICompatibleService,
  logContext: { requestId: string }
): Promise<string> {
  try {
    // Log the operation with request ID for audit trail
    logger.info({
      ...logContext,
      tool: 'generateCode',
      params: { language: params.language }
    }, 'Generating code');
    
    // Validate parameters to prevent injection attacks
    const validatedParams = generateCodeSchema.parse(params);
    
    // Build a well-structured prompt for the model
    const messages = [
      {
        role: 'system',
        content: `You are a code generation assistant. Generate clean, secure, and efficient ${validatedParams.language} code based on the given instructions. Focus on clarity and best practices.`
      },
      {
        role: 'user',
        content: `${validatedParams.instruction}${validatedParams.context ? `\n\nContext: ${validatedParams.context}` : ''}`
      }
    ];
    
    // Call the model with strict timeouts and error handling
    const completion = await Promise.race([
      model.chat.completions.create({
        model: 'qwen', // Assuming this is the model ID used by your local LLM service
        messages,
        temperature: 0.2,
        max_tokens: 2048
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Model request timed out after 30s')), 30000))
    ]);
    
    // Extract and validate the generated code
    const generatedCode = completion.choices[0]?.message?.content || '';
    
    // Log success
    logger.info({
      ...logContext,
      tool: 'generateCode',
      status: 'success',
      chars: generatedCode.length
    }, 'Code generation completed');
    
    return generatedCode;
  } catch (error) {
    // Log failures with detailed error information
    logger.error({
      ...logContext,
      tool: 'generateCode',
      error: error instanceof Error ? { 
        message: error.message,
        stack: error.stack
      } : String(error)
    }, 'Code generation failed');
    
    throw error;
  }
} 