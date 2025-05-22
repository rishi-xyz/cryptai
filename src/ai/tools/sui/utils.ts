import { SuiClient } from '@mysten/sui/client';

export const Testnetclient = new SuiClient({
  url: 'https://fullnode.testnet.sui.io',
});
