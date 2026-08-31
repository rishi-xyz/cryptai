// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'google/gemini-2.5-flash',
    label: 'gemini 2.5 flash',
    apiIdentifier: 'google/gemini-2.5-flash',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    label: 'claude 3.5 sonnet',
    apiIdentifier: 'anthropic/claude-3.5-sonnet',
    description: 'Balanced model for general-purpose tasks',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'google/gemini-2.5-flash';
