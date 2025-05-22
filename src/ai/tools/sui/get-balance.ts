import { z } from 'zod';
import { tool } from 'ai';
import { Testnetclient } from './utils';

export const getbalance = tool({
  description:
    'Get the list of all balances for a given wallet address, including coin metadata.',
  parameters: z.object({
    address: z.string().describe('The wallet address to fetch balances for'),
  }),
  execute: async ({ address }: { address: string }) => {
    try {
      const balances = await Testnetclient.getAllBalances({ owner: address });

      const result = await Promise.all(
        balances.map(async (balance) => {
          const metadata = await Testnetclient.getCoinMetadata({
            coinType: balance.coinType,
          });

          return {
            address: balance.coinType,
            name: metadata?.name || '',
            symbol: metadata?.symbol || '',
            decimals: metadata?.decimals || 0,
            balance: (
              Number(balance.totalBalance) /
              10 ** (metadata?.decimals || 0)
            ).toString(),
          };
        }),
      );

      return { balances: result };
    } catch (error: any) {
      return { error: `Failed to get balances: ${error.message}` };
    }
  },
});
