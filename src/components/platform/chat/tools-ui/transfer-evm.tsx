'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Provider,
  useAppKitProvider,
  useAppKitAccount,
  useAppKitNetwork,
} from '@reown/appkit/react';
import { BrowserProvider } from 'ethers';
import { toast } from 'sonner';

interface TransferResult {
  TxData: {
    to: string;
    value: string;
    chainId: number;
    gasLimit?: string;
    gasPrice?: string;
    nonce?: number;
  };
  serializedTx: string;
  message: string;
  amount: number;
  recipient: string;
  sender: string;
  chainId: number;
  chainName: string;
  currency: string;
  error?: string;
}

export const TransferEVM = ({
  RecievedResult,
}: {
  RecievedResult?: TransferResult;
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  if (!RecievedResult) return null;

  if (RecievedResult.error) {
    return (
      <div className="space-y-4 rounded-lg border border-red-700 bg-red-900/20 p-4 text-sm text-red-200 shadow-lg">
        <h3 className="text-lg font-semibold text-red-400">
          Transaction Error
        </h3>
        <p className="text-red-300">{RecievedResult.error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigator.clipboard.writeText(RecievedResult.error!)}
        >
          Copy Full Error
        </Button>
      </div>
    );
  }

  const { TxData, message, amount, recipient, chainName, currency } =
    RecievedResult;

  const handleApprove = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!walletProvider) {
      toast.error('Wallet provider not available');
      return;
    }

    setIsProcessing(true);

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const from = await signer.getAddress();
      const network = await ethersProvider.getNetwork();
      console.log('Approve transation network id :', network.chainId);
      if (Number(chainId) !== TxData.chainId) {
        toast.error('Wrong network', {
          description: `Please switch to ${chainName} (Chain ID: ${TxData.chainId})`,
        });
        return;
      }

      const [feeData] = await Promise.all([ethersProvider.getFeeData()]);

      let gasLimit: bigint;
      try {
        gasLimit = await ethersProvider.estimateGas({
          from,
          to: TxData.to,
          value: TxData.value,
        });
        gasLimit = (gasLimit * BigInt(120)) / BigInt(100);
      } catch {
        gasLimit = BigInt(21000); // fallback
      }

      const transactionRequest: any = {
        to: TxData.to,
        value: TxData.value,
        chainId: TxData.chainId,
        gasLimit,
      };

      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        transactionRequest.maxFeePerGas = feeData.maxFeePerGas;
        transactionRequest.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      } else if (feeData.gasPrice) {
        transactionRequest.gasPrice = feeData.gasPrice;
      }

      if (TxData.gasLimit) {
        transactionRequest.gasLimit = BigInt(TxData.gasLimit);
      }
      if (TxData.gasPrice) {
        transactionRequest.gasPrice = BigInt(TxData.gasPrice);
        delete transactionRequest.maxFeePerGas;
        delete transactionRequest.maxPriorityFeePerGas;
      }
      if (TxData.nonce !== undefined) {
        transactionRequest.nonce = TxData.nonce;
      }

      toast.info('Sending transaction...', {
        description: 'Please confirm in your wallet',
      });

      const txResponse = await signer.sendTransaction(transactionRequest);

      toast.success('Transaction Sent!', {
        description: `Hash: ${txResponse.hash}`,
        action: {
          label: 'Copy Hash',
          onClick: () => navigator.clipboard.writeText(txResponse.hash),
        },
        duration: 10,
      });

      toast.info('Waiting for confirmation...');
      const receipt = await txResponse.wait();

      if (receipt?.status === 1) {
        toast.success('Transaction Confirmed!', {
          description: `Successfully sent ${amount} ${currency} to ${recipient}`,
        });
      } else {
        toast.error('Transaction failed during confirmation');
      }
    } catch (err: any) {
      console.error('Transaction error:', err);
      const shortMessage = err?.reason || err?.message || 'Transaction failed';
      const fullError =
        typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);

      toast.error(shortMessage, {
        action: {
          label: 'Copy Full Error',
          onClick: () => navigator.clipboard.writeText(fullError),
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200 shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-fuchsia-400">
          Transfer {currency} Transaction
        </h3>
        <p className="text-zinc-400">{message}</p>
        <p className="text-xs text-zinc-500">
          {chainName} (Chain ID: {TxData.chainId})
        </p>
      </div>

      <div>
        <h4 className="flex items-center justify-between font-semibold text-zinc-300">
          Transaction Data (Raw)
          <Button
            variant="ghost"
            className="px-2 py-0 text-xs"
            onClick={() => setShowRaw((prev) => !prev)}
          >
            {showRaw ? 'Hide' : 'Show'}
          </Button>
        </h4>
        {showRaw && (
          <pre className="overflow-x-auto rounded-md bg-zinc-800 p-2 text-xs break-words whitespace-pre-wrap text-yellow-300">
            {JSON.stringify(TxData, null, 2)}
          </pre>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-zinc-300">Summary</h4>
        <div className="space-y-1 text-zinc-400">
          <p>
            <span className="text-zinc-500">Amount:</span>{' '}
            <span className="font-medium text-white">
              {amount} {currency}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">To:</span>{' '}
            <span className="font-mono text-xs break-words text-white">
              {recipient}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">Network:</span>{' '}
            <span className="text-white">{chainName}</span>
          </p>
        </div>
      </div>

      <Button
        className="w-full bg-fuchsia-500 transition hover:bg-fuchsia-600 disabled:bg-zinc-600 disabled:text-zinc-400"
        onClick={handleApprove}
        disabled={!isConnected || isProcessing}
      >
        {!isConnected
          ? 'Connect Wallet'
          : isProcessing
            ? 'Processing...'
            : 'Approve Transaction'}
      </Button>
    </div>
  );
};
