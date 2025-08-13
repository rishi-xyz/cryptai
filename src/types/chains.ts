import { AppKitNetwork } from '@reown/appkit/networks';

export type InternalChainNamespace =
  | 'eip155'
  | 'solana'
  | 'polkadot'
  | 'bip122'
  | 'cosmos';
export type ChainNamespace<T extends string = InternalChainNamespace> =
  | T
  | InternalChainNamespace;

export interface chainsI {
  id: number;
  value: string;
  label: string;
  namespace: ChainNamespace;
  caipNetwork: AppKitNetwork;
  developemnt?: boolean;
}
