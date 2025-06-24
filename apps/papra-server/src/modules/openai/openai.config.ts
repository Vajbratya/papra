import type { ConfigDefinition } from 'figue';
import { z } from 'zod';

export const openAiConfig = {
  apiKey: {
    doc: 'API key for OpenAI',
    schema: z.string().default(''),
    env: 'OPENAI_API_KEY',
  },
  model: {
    doc: 'OpenAI model used for radiology reports',
    schema: z.string(),
    default: 'gpt-4o',
    env: 'OPENAI_MODEL',
  },
} as const satisfies ConfigDefinition;
