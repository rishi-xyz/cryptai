import { z } from 'zod';
import { tool } from 'ai';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';

export const transfersui = tool({
  description:
    "Create a SUI transfer transaction to be signed by the user's wallet. Optional parameters include sender, gas budget, gas price, expiration, and gas owner.",
  parameters: z.object({
    recipient: z.string().describe("The recipient's wallet address"),
    amount: z.number().describe('Amount of SUI to send'),
    sender: z.string().optional().describe('Optional sender address'),
    gasBudget: z.number().optional().describe('Optional gas budget in MIST'),
    gasPrice: z.number().optional().describe('Optional gas price in MIST'),
    gasOwner: z.string().optional().describe('Optional gas owner address'),
    expiration: z.number().optional().describe('Optional expiration timestamp'),
  }),
  execute: async ({
    recipient,
    amount,
    sender,
    gasBudget,
    gasPrice,
    gasOwner,
    expiration,
  }: {
    recipient: string;
    amount: number;
    sender?: string;
    gasBudget?: number;
    gasPrice?: number;
    gasOwner?: string;
    expiration?: number;
  }) => {
    try {
      const tx = new Transaction();
      if (sender) {
        tx.setSender(sender);
      }
      if (expiration) {
        tx.setExpiration({ Epoch: expiration });
      }
      if (gasBudget) {
        tx.setGasBudget(BigInt(gasBudget));
      }
      if (gasPrice) {
        tx.setGasPrice(BigInt(gasPrice));
      }
      if (gasOwner) {
        tx.setGasOwner(gasOwner);
      }
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
        sender: sender ?? null,
        gasBudget: gasBudget ?? null,
        gasPrice: gasPrice ?? null,
        gasOwner: gasOwner ?? null,
        expiration: expiration ?? null,
      };
    } catch (error: any) {
      return { error: `Failed to create transaction: ${error.message}` };
    }
  },
});
