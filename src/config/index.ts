import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, monadTestnet, sepolia } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_PROJECT_ID is not defined. Set it in your environment (see .env.example) before starting the app.',
  );
}

export const networks = [mainnet, monadTestnet, sepolia] as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
