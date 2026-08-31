'use client';

import { type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useScrollToBottom } from '@/src/hooks/use-scrolltobottom';
import { useState, useMemo } from 'react';
import { Overview } from './overview';
import { ViewMessages } from './view-messages';
import { MultimodalInput } from './multimodalinput';
import { ChatHeader } from './chat-header';
import { useUserWalletData } from '@/src/store/wallet-store';

export type Attachment = {
  url: string;
  name?: string;
  contentType?: string;
};

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedModelId: string;
  isReadonly: boolean;
}) {
  const userWallet = useUserWalletData();

  const chatBody = useMemo(
    () => ({
      id,
      userWalletAddress: userWallet.useraddress,
      currentchain: userWallet.chainName,
      currentchainID: userWallet.chainId,
    }),
    [id, userWallet.useraddress, userWallet.chainId, userWallet.chainName],
  );

  const { messages, sendMessage, stop, status } = useChat({
    id,
    messages: initialMessages,
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="bg-background sticky top-0 z-10 border-b border-zinc-800">
        <ChatHeader selectedModelId={selectedModelId} isReadonly={isReadonly} />
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-2 py-4 md:px-4"
      >
        <div className="flex flex-col items-center gap-4">
          {messages.length === 0 && <Overview />}
          {messages.map((message) => (
            <ViewMessages key={message.id} message={message} />
          ))}
          <div
            ref={messagesEndRef}
            className="min-h-[24px] min-w-[24px] shrink-0"
          />
        </div>
      </div>

      <div className="bg-background sticky bottom-0 z-10 border-t border-zinc-800 px-4 py-2 md:px-0">
        <form className="mx-auto flex w-full max-w-[500px] flex-row items-end gap-2">
          <MultimodalInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            body={chatBody}
          />
        </form>
      </div>
    </div>
  );
}
