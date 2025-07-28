'use client';

import { createAppKit } from '@reown/appkit';
import {
  mainnet,
  arbitrum,
  base,
  solana,
  monadTestnet,
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
const metadata = {
  name: 'CryptAI',
  description: 'Talk to blockchain in Natural Language',
  url: 'https://cryptai-eight.vercel.app', // origin must match your domain & subdomain
  icons: [
    'https://drive.google.com/drive/folders/1-GKGLD2YQI2PlO5rtSwYTGPvegzubQWs?usp=sharing',
  ],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, base, solana, monadTestnet],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    email: true,
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: ['google', 'x', 'github', 'discord'],
    emailShowWallets: true,
  },
  themeMode: 'dark',
});

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
