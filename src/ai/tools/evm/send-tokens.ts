import { z } from 'zod';
import { tool } from 'ai';
import { ethers } from 'ethers';

function isValidEthereumAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

function createTransactionData(
  recipient: string,
  amount: number,
  sender: string,
  chainId: number,
  chainName: string,
  currency: string,
  gasLimit?: number,
  gasPrice?: string,
  nonce?: number,
) {
  try {
    if (!isValidEthereumAddress(recipient)) {
      throw new Error(`Invalid recipient address: ${recipient}`);
    }
    if (!isValidEthereumAddress(sender)) {
      throw new Error(`Invalid sender address: ${sender}`);
    }
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    const resolvedRecipient = ethers.getAddress(recipient);
    const resolvedSender = ethers.getAddress(sender);
    const valueInWei = ethers.parseEther(amount.toString());
    if (gasLimit !== undefined && (gasLimit < 21000 || gasLimit > 10000000)) {
      throw new Error('Gas limit must be between 21,000 and 10,000,000');
    }
    if (gasPrice !== undefined) {
      try {
        const gasPriceBigInt = BigInt(gasPrice);
        if (gasPriceBigInt <= 0) {
          throw new Error('Gas price must be greater than 0');
        }
      } catch {
        throw new Error('Invalid gas price format');
      }
    }
    if (nonce !== undefined && nonce < 0) {
      throw new Error('Nonce must be non-negative');
    }

    const txData = {
      to: resolvedRecipient,
      value: valueInWei.toString(),
      chainId,
      gasLimit: gasLimit?.toString(),
      gasPrice: gasPrice,
      nonce: nonce,
    };

    let serializedTx: string;
    try {
      const transactionFields: any = {
        to: resolvedRecipient,
        value: valueInWei,
        chainId: chainId,
      };

      if (gasLimit) transactionFields.gasLimit = BigInt(gasLimit);
      if (gasPrice) transactionFields.gasPrice = BigInt(gasPrice);
      if (nonce !== undefined) transactionFields.nonce = nonce;

      const transaction = ethers.Transaction.from(transactionFields);
      serializedTx = transaction.serialized;
    } catch (serializationError) {
      console.warn(
        'Serialization failed, using fallback method:',
        serializationError,
      );
      serializedTx =
        '0x' +
        Buffer.from(
          JSON.stringify(txData, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          ),
        ).toString('hex');
    }

    return {
      TxData: txData,
      serializedTx,
      message: `Unsigned ${currency} transaction prepared for ${chainName}. Click to sign with your connected wallet.`,
      amount,
      recipient: resolvedRecipient,
      sender: resolvedSender,
      gasLimit: gasLimit ?? null,
      gasPrice: gasPrice ?? null,
      nonce: nonce ?? null,
      chainId,
      chainName,
      currency,
    };
  } catch (error: any) {
    return {
      error: `Failed to create ${chainName} transaction: ${error.message}`,
      chainId,
      chainName,
      currency,
    };
  }
}

export const transferethereummainnet = tool({
  description:
    'Create an unsigned transaction for sending ETH on Ethereum Mainnet (Chain ID: 1). Send native ETH tokens with serialized transaction data.',
  parameters: z.object({
    recipient: z
      .string()
      .describe(
        'Recipient or users wallet address (must be a valid Ethereum address)',
      ),
    amount: z.number().positive().describe('Amount in ETH (must be positive)'),
    sender: z
      .string()
      .describe(
        'Sender wallet address (must be a valid Ethereum address), address where suer wants to send money',
      ),
    gasLimit: z
      .number()
      .int()
      .min(21000)
      .max(10000000)
      .optional()
      .describe('Optional gas limit (21000-10000000)'),
    gasPrice: z
      .string()
      .optional()
      .describe('Optional gas price in wei (as string)'),
    nonce: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Optional nonce (non-negative integer)'),
  }),
  execute: async ({ recipient, amount, sender, gasLimit, gasPrice, nonce }) => {
    return createTransactionData(
      recipient,
      amount,
      sender,
      1,
      'Ethereum Mainnet',
      'ETH',
      gasLimit,
      gasPrice,
      nonce,
    );
  },
});

export const transferethereumsepolia = tool({
  description:
    'Create an unsigned transaction for sending ETH on Ethereum Sepolia Testnet (Chain ID: 11155111). Send testnet ETH tokens with serialized transaction data.',
  parameters: z.object({
    recipient: z
      .string()
      .describe('Recipient wallet address (must be a valid Ethereum address)'),
    amount: z.number().positive().describe('Amount in ETH (must be positive)'),
    sender: z
      .string()
      .describe('Sender wallet address (must be a valid Ethereum address)'),
    gasLimit: z
      .number()
      .int()
      .min(21000)
      .max(10000000)
      .optional()
      .describe('Optional gas limit (21000-10000000)'),
    gasPrice: z
      .string()
      .optional()
      .describe('Optional gas price in wei (as string)'),
    nonce: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Optional nonce (non-negative integer)'),
  }),
  execute: async ({ recipient, amount, sender, gasLimit, gasPrice, nonce }) => {
    return createTransactionData(
      recipient,
      amount,
      sender,
      11155111,
      'Ethereum Sepolia',
      'ETH',
      gasLimit,
      gasPrice,
      nonce,
    );
  },
});

export const transfermonadtestnet = tool({
  description:
    'Create an unsigned transaction for sending MON on Monad Testnet (Chain ID: 10143). Send native MON tokens with serialized transaction data.',
  parameters: z.object({
    recipient: z
      .string()
      .describe('Recipient wallet address (must be a valid Ethereum address)'),
    amount: z.number().positive().describe('Amount in MON (must be positive)'),
    sender: z
      .string()
      .describe('Sender wallet address (must be a valid Ethereum address)'),
    gasLimit: z
      .number()
      .int()
      .min(21000)
      .max(10000000)
      .optional()
      .describe('Optional gas limit (21000-10000000)'),
    gasPrice: z
      .string()
      .optional()
      .describe('Optional gas price in wei (as string)'),
    nonce: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Optional nonce (non-negative integer)'),
  }),
  execute: async ({ recipient, amount, sender, gasLimit, gasPrice, nonce }) => {
    return createTransactionData(
      recipient,
      amount,
      sender,
      10143,
      'Monad Testnet',
      'MON',
      gasLimit,
      gasPrice,
      nonce,
    );
  },
});
