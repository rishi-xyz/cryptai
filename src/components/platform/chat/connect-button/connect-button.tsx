'use client';

import { Button } from '@/src/components/ui/button';
import { AppkitProvider } from '@/src/context';
import { AppKit } from '@reown/appkit';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

export const ConnectButton = () => {
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  return (
    <AppkitProvider>
      <div className="flex">
        <Button variant={'fushia'}>Connect</Button>
      </div>
    </AppkitProvider>
  );
};
