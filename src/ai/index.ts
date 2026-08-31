import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const openrouter = createOpenRouter();

export const openRouterProModel = wrapLanguageModel({
  model: openrouter('google/gemini-2.5-flash'),
  middleware: customMiddleware,
});

export const openRouterFlashModel = wrapLanguageModel({
  model: openrouter('anthropic/claude-3.5-sonnet'),
  middleware: customMiddleware,
});
