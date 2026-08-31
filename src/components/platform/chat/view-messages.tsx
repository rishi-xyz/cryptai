'use client';

import {
  getToolName,
  isDynamicToolUIPart,
  isToolUIPart,
  type UIMessage,
} from 'ai';
import { motion } from 'framer-motion';

import { BotIcon, UserIcon } from 'lucide-react';
import { Markdown } from './markdown';
import { PreviewAttachment } from './preview-attachment';
import { GetBalance } from './tools-ui/get-balance-ui';
import { TransferSui } from './tools-ui/transfer-sui';
import { TransferEVM } from './tools-ui/transfer-evm';

export const ViewMessages = ({ message }: { message: UIMessage }) => {
  return (
    <motion.div
      className="flex w-full flex-row gap-4 px-4 first-of-type:pt-20 md:w-[500px] md:px-0"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex size-[24px] shrink-0 flex-col items-center justify-center rounded-sm border p-1 text-zinc-500">
        {message.role === 'assistant' ? (
          <BotIcon className="text-fuchsia-500" />
        ) : (
          <UserIcon className="text-white" />
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        {message.parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div key={index} className="flex flex-col gap-4 text-zinc-300">
                <Markdown>{part.text}</Markdown>
              </div>
            );
          }

          if (part.type === 'file') {
            return (
              <PreviewAttachment
                key={index}
                attachment={{
                  url: part.url,
                  name: part.filename,
                  contentType: part.mediaType,
                }}
              />
            );
          }

          if (isToolUIPart(part) || isDynamicToolUIPart(part)) {
            const toolName = getToolName(part);
            const { state, toolCallId } = part;
            const toolResult = (part as { output?: unknown }).output;

            return (
              <div key={index} className="flex flex-col gap-4">
                {state === 'output-available' ? (
                  <div key={toolCallId}>
                    {toolName === 'getbalance' ? (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <GetBalance RecievedResult={toolResult as any} />
                    ) : toolName === 'transfersui' ? (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <TransferSui RecievedResult={toolResult as any} />
                    ) : toolName === 'transferethereummainnet' ||
                      toolName === 'transferethereumsepolia' ||
                      toolName === 'transfermonadtestnet' ? (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <TransferEVM RecievedResult={toolResult as any} />
                    ) : (
                      <div>{JSON.stringify(toolResult, null, 2)}</div>
                    )}
                  </div>
                ) : (
                  <div key={toolCallId} className="skeleton">
                    {toolName === 'getbalance' ? (
                      <GetBalance />
                    ) : toolName === 'transfersui' ? (
                      <TransferSui />
                    ) : (
                      (toolName === 'transferethereummainnet' ||
                        toolName === 'transferethereumsepolia' ||
                        toolName === 'transfermonadtestnet') && <TransferEVM />
                    )}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </motion.div>
  );
};
