import { SuiClient } from '@mysten/sui/client';

export const Testnetclient = new SuiClient({
  url: process.env.PUBLIC_NODE || 'https://fullnode.testnet.sui.io',
});
