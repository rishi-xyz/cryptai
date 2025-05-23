'use client';

import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { ModelSelector } from './modal-selector';
import { SidebarToggle } from './sidebar-toogle';
import { Button } from '../../ui/button';
import { PlusIcon } from 'lucide-react';
import { useSidebar } from '../../ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import WalletProviderWrapper from '../../globals/wallet-wrapper';
import { ConnectButton } from '@suiet/wallet-kit';

function PureChatHeader({
  selectedModelId,
  isReadonly,
}: {
  selectedModelId: string;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();

  return (
    <header className="bg-background sticky top-0 flex w-full items-center justify-between px-2 py-1.5 md:px-2">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarToggle />

        {(!open || windowWidth < 768) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={'outline'}
                className="cursor-pointer border-2 px-2 hover:border-fuchsia-500"
                onClick={() => {
                  router.push('/chat');
                  router.refresh();
                }}
              >
                <PlusIcon />
                <span className="md:sr-only">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        )}

        {!isReadonly && (
          <ModelSelector
            selectedModelId={selectedModelId}
            className="cursor-pointer"
          />
        )}
      </div>

      {/* Right Section */}
      <div className="ml-auto">
        <WalletProviderWrapper>
          <div className="overflow-hidden rounded-md bg-fuchsia-500 text-white">
            <Button asChild size="sm" variant={'fushia'}>
              <ConnectButton
                className="bg-fuchsia-500 text-white hover:bg-fuchsia-600"
                style={{
                  backgroundColor: 'transparent',
                }}
              />
            </Button>
          </div>
        </WalletProviderWrapper>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
