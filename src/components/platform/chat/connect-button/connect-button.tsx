'use client';
import { useEffect } from 'react';
import { modal } from '@/src/context';
import {
  createAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from '@reown/appkit/react';
import { useWalletStore } from '@/src/store/wallet-store';

export const ConnectButton = () => {
  createAppKit(modal);
  const { address, isConnected } = useAppKitAccount();
  const { chainId, caipNetwork } = useAppKitNetwork();
  const setWalletData = useWalletStore((state) => state.setWalletData);
  const disconnect = useWalletStore((state) => state.disconnect);
  const chainName: string | null = caipNetwork?.name ?? null;

  // Sync AppKit state with Zustand store
  useEffect(() => {
    if (isConnected && address && chainId !== undefined) {
      setWalletData({
        address,
        chainId: Number(chainId), // ensure number type
        chainName,
      });
      console.log('Wallet state updated:', { address, chainId, chainName });
    } else {
      disconnect();
      console.log('Wallet disconnected');
    }
  }, [address, isConnected, chainId, chainName, setWalletData, disconnect]);

  return (
    <div className="flex">
      <appkit-button />
    </div>
  );
};
