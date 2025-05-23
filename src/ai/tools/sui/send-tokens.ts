import { z } from 'zod';
import { tool } from 'ai';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';

export const transfersui = tool({
  description:
    "Create a SUI transfer transaction to be signed by the user's wallet.",
  parameters: z.object({
    recipient: z.string().describe("The recipient's wallet address"),
    amount: z.number().describe('Amount of SUI to send'),
  }),
  execute: async ({
    recipient,
    amount,
  }: {
    recipient: string;
    amount: number;
  }) => {
    try {
      const tx = new Transaction();

      const amountInMist = BigInt(Math.floor(amount * Number(MIST_PER_SUI)));

      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);
      tx.transferObjects([coin], tx.pure.address(recipient));

      const TxData = tx.getData();
      const serializedTx = tx.serialize();

      return {
        TxData,
        serializedTx,
        message:
          'Transaction prepared. Please sign this transaction using your wallet.',
        amount,
        recipient,
      };
    } catch (error: any) {
      return { error: `Failed to create transaction: ${error.message}` };
    }
  },
});
