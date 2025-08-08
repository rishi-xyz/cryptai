'use client';

import { Button } from '@/src/components/ui/button';
import { modal } from '@/src/context';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitBalance,
} from '@reown/appkit/react';
import { Loader2 } from 'lucide-react';

export const ConnectButton = () => {
  createAppKit(modal);
  // const { open } = useAppKit()
  return (
    <div className="flex">
      <appkit-button />
    </div>
  );
};
