import { generateId, type UIMessage } from 'ai';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dataFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(
      'An occured while fetching the data',
    ) as ApplicationError;
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type LegacyAttachment = {
  url: string;
  name?: string;
  contentType?: string;
};

type LegacyToolInvocation = {
  toolCallId: string;
  toolName: string;
  args?: unknown;
  state?: string;
  result?: unknown;
};

type LegacyContentPart = {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: unknown;
};

type LegacyMessage = {
  id?: string;
  role: string;
  content?: string | Array<LegacyContentPart>;
  toolInvocations?: Array<LegacyToolInvocation>;
  experimental_attachments?: Array<LegacyAttachment>;
  parts?: Array<Record<string, unknown>>;
};

export function convertToUIMessages(
  messages: Array<LegacyMessage>,
): Array<UIMessage> {
  return messages.map((message) => {
    if (message.parts && Array.isArray(message.parts)) {
      return {
        id: message.id ?? generateId(),
        role: message.role as UIMessage['role'],
        parts: message.parts as UIMessage['parts'],
      };
    }

    const parts: Array<Record<string, unknown>> = [];

    if (typeof message.content === 'string' && message.content) {
      parts.push({ type: 'text', text: message.content });
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === 'text' && content.text) {
          parts.push({ type: 'text', text: content.text });
        } else if (content.type === 'tool-call' && content.toolName) {
          parts.push({
            type: `tool-${content.toolName}`,
            toolCallId: content.toolCallId ?? generateId(),
            state: 'output-available',
            input: content.args,
            output: undefined,
          });
        }
      }
    }

    if (message.toolInvocations) {
      for (const toolInvocation of message.toolInvocations) {
        parts.push({
          type: `tool-${toolInvocation.toolName}`,
          toolCallId: toolInvocation.toolCallId,
          state:
            toolInvocation.state === 'result'
              ? 'output-available'
              : 'input-available',
          input: toolInvocation.args,
          output: toolInvocation.result,
        });
      }
    }

    if (message.experimental_attachments) {
      for (const attachment of message.experimental_attachments) {
        parts.push({
          type: 'file',
          url: attachment.url,
          filename: attachment.name,
          mediaType: attachment.contentType ?? 'application/octet-stream',
        });
      }
    }

    return {
      id: message.id ?? generateId(),
      role: message.role as UIMessage['role'],
      parts: parts as UIMessage['parts'],
    };
  });
}
