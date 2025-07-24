import { google } from '@ai-sdk/google';
import { wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const geminiProModel = wrapLanguageModel({
  model: google('gemini-2.5-flash-lite'),
  middleware: customMiddleware,
});

export const geminiFlashModel = wrapLanguageModel({
  model: google('gemini-2.5-flash'),
  middleware: customMiddleware,
});
