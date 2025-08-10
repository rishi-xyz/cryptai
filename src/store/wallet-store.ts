import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useMemo } from 'react';

export interface WalletState {
  // Wallet connection data
  address: string | null;
  chainId: number;
  chainName: string | null;
  isConnected: boolean;

  // Actions
  setWalletData: (data: {
    address: string | null;
    chainId: number;
    chainName: string | null;
  }) => void;

  disconnect: () => void;

  // Computed getters
  getUserWallet: () => {
    useraddress: string | null;
    chainId: number;
    chainName: string | null;
  };
}

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        address: null,
        chainId: 1, // Default to Ethereum mainnet
        chainName: null,
        isConnected: false,

        // Actions
        setWalletData: (data) => {
          set(
            {
              address: data.address,
              chainId: data.chainId,
              chainName: data.chainName,
              isConnected: !!data.address,
            },
            false,
            'setWalletData',
          );
        },

        disconnect: () => {
          set(
            {
              address: null,
              chainId: 1,
              chainName: null,
              isConnected: false,
            },
            false,
            'disconnect',
          );
        },

        // Computed getter for chat body format
        getUserWallet: () => {
          const state = get();
          return {
            useraddress: state.address,
            chainId: state.chainId,
            chainName: state.chainName,
          };
        },
      }),
      {
        name: 'wallet-store',
        // Only persist essential data
        partialize: (state) => ({
          address: state.address,
          chainId: state.chainId,
          chainName: state.chainName,
          isConnected: state.isConnected,
        }),
      },
    ),
    { name: 'WalletStore' },
  ),
);

// Selector hooks for optimized re-renders
export const useWalletAddress = () => useWalletStore((state) => state.address);
export const useWalletChain = () =>
  useWalletStore((state) => ({
    chainId: state.chainId,
    chainName: state.chainName,
  }));
export const useIsWalletConnected = () =>
  useWalletStore((state) => state.isConnected);

// Stable selector for user wallet data to prevent infinite re-renders
export const useUserWalletData = () => {
  const address = useWalletStore((state) => state.address);
  const chainId = useWalletStore((state) => state.chainId);
  const chainName = useWalletStore((state) => state.chainName);

  return useMemo(
    () => ({
      useraddress: address,
      chainId,
      chainName,
    }),
    [address, chainId, chainName],
  );
};
