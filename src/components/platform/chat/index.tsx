'use client';

import { Attachment, Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useScrollToBottom } from '@/src/hooks/use-scrolltobottom';
import { useState } from 'react';
import { Overview } from './overview';
import { ViewMessages } from './view-messages';
import { MultimodalInput } from './multimodalinput';
import { ChatHeader } from './chat-header';

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  isReadonly: boolean;
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, '', `/chat/${id}`); //replace the page without refreshing for better ui
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="bg-background flex h-dvh flex-col justify-between pb-4 md:pb-8">
      {/* Full-width header at the top */}
      <ChatHeader selectedModelId={selectedModelId} isReadonly={isReadonly} />

      {/* Scrollable message + input container */}
      <div className="flex flex-1 flex-col items-center justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex h-full w-dvw flex-col items-center gap-4 overflow-y-scroll"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message) => (
            <ViewMessages
              key={message.id}
              chatId={id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              toolInvocations={message.toolInvocations}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="min-h-[24px] min-w-[24px] shrink-0"
          />
        </div>

        <form className="max-w-[calc(100dvw-32px) relative flex w-full flex-row items-end gap-2 px-4 md:max-w-[500px] md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={append}
          />
        </form>
      </div>
    </div>
  );
}
