'use client';
import { useEffect } from 'react';
import { modal } from '@/src/context';
import { createAppKit } from '@reown/appkit/react';
import { useAccount, useChainId, useChains } from 'wagmi';
import { useWalletStore } from '@/src/store/wallet-store'; // Adjust path as needed

export const ConnectButton = () => {
  createAppKit(modal);

  // Wagmi hooks to monitor changes
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();

  // Zustand store actions
  const setWalletData = useWalletStore((state) => state.setWalletData);
  const disconnect = useWalletStore((state) => state.disconnect);

  // Sync Wagmi state with Zustand store
  useEffect(() => {
    if (isConnected && address) {
      // Find the current chain name from the chains array
      const currentChain = chains.find((chain) => chain.id === chainId);
      const chainName = currentChain?.name || null;

      setWalletData({
        address,
        chainId,
        chainName,
      });

      console.log('Wallet state updated:', { address, chainId, chainName });
    } else {
      disconnect();
      console.log('Wallet disconnected');
    }
  }, [address, isConnected, chainId, chains, setWalletData, disconnect]);

  // Additional effect to handle chain changes specifically
  useEffect(() => {
    if (isConnected && address && chainId) {
      const currentChain = chains.find((chain) => chain.id === chainId);
      const chainName = currentChain?.name || null;

      setWalletData({
        address,
        chainId,
        chainName,
      });

      console.log('Chain switched:', { chainId, chainName });
    }
  }, [chainId, isConnected, address, chains, setWalletData]);

  return (
    <div className="flex">
      <appkit-button />
    </div>
  );
};
