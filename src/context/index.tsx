'use client';

import { CreateAppKit } from '@reown/appkit';
import {
  mainnet,
  solana,
  monadTestnet,
  base,
  sepolia,
} from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

import { wagmiAdapter, projectId } from '@/src/config';

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
export const metadata = {
  name: 'CryptAI',
  description: 'Talk to blockchain in Natural Language',
  url: 'https://cryptai-eight.vercel.app', // origin must match your domain & subdomain
  icons: [
    'https://drive.google.com/drive/folders/1-GKGLD2YQI2PlO5rtSwYTGPvegzubQWs?usp=sharing',
  ],
};

// Create the modal
export const modal = {
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, solana, monadTestnet, base, sepolia],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeMode: 'dark',
} as CreateAppKit;

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
