import { z } from 'zod';
import { tool } from 'ai';
import { ethers } from 'ethers';

export const transferevm = tool({
  description:
    "Create an unsigned EVM transaction object for sending native tokens with serialized data. required parameters are wallet address of recipient, amount in ethers or eth and sender's or user's wallet address will be present in body",
  parameters: z.object({
    recipient: z.string().describe('Recipient wallet address'),
    amount: z.number().describe('Amount in ether'),
    sender: z.string().describe('Sender wallet address'),
    chainId: z.number().optional().describe('Optional EVM chain ID'),
    gasLimit: z.number().optional().describe('Optional gas limit'),
    gasPrice: z.string().optional().describe('Optional gas price'),
    nonce: z.number().optional().describe('Optional Nonce'),
  }),
  execute: async ({
    recipient,
    amount,
    sender,
    chainId,
    gasLimit,
    gasPrice,
    nonce,
  }) => {
    try {
      if (!chainId) {
        throw new Error('Chain ID is required if not auto-provided by UI.');
      }

      // Validate and checksum the addresses
      const resolvedRecipient = ethers.getAddress(recipient);
      const resolvedSender = ethers.getAddress(sender);
      const valueInWei = ethers.parseEther(amount.toString());

      // Create transaction object with proper types
      const txData = {
        to: resolvedRecipient,
        value: valueInWei,
        chainId,
        gasLimit: gasLimit ? BigInt(gasLimit) : undefined,
        gasPrice: gasPrice ? BigInt(gasPrice) : undefined,
        nonce: nonce,
      };

      // Create serialized transaction
      let serializedTx: string;
      try {
        const transaction = ethers.Transaction.from({
          to: resolvedRecipient,
          value: valueInWei,
          gasLimit: txData.gasLimit,
          gasPrice: txData.gasPrice,
          nonce: txData.nonce,
          chainId: chainId,
        });
        serializedTx = transaction.serialized;
      } catch (serializationError) {
        // Fallback if serialization fails
        serializedTx =
          '0x' + Buffer.from(JSON.stringify(txData)).toString('hex');
      }

      return {
        TxData: {
          to: resolvedRecipient,
          value: valueInWei.toString(),
          gasLimit: gasLimit ? gasLimit.toString() : undefined,
          gasPrice: gasPrice || undefined,
          nonce: nonce,
          chainId: chainId,
        },
        serializedTx,
        message:
          'Unsigned transaction prepared. Click to sign with your connected wallet.',
        amount,
        recipient: resolvedRecipient,
        sender: resolvedSender,
        gasLimit: gasLimit ?? null,
        gasPrice: gasPrice ?? null,
        nonce: nonce ?? null,
        chainId,
      };
    } catch (error: any) {
      return { error: `Failed to create transaction: ${error.message}` };
    }
  },
});
