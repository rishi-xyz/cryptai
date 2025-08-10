'use client';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Provider,
  useAppKitProvider,
  useAppKitAccount,
} from '@reown/appkit/react';
import { BrowserProvider } from 'ethers';
import { toast } from 'sonner';

export const TransferEVM = ({
  RecievedResult,
}: {
  RecievedResult?: {
    TxData: any;
    serializedTx: string;
    message: string;
    amount: number;
    recipient: string;
    sender: string;
    chainId: number;
  };
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const [showSerialized, setShowSerialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { address, isConnected } = useAppKitAccount();

  if (!RecievedResult) return null;

  const { TxData, serializedTx, message, amount, recipient, sender, chainId } =
    RecievedResult;

  const handleSignTransaction = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!walletProvider) {
      toast.error('Wallet provider not available');
      return;
    }

    setIsLoading(true);

    try {
      // Create ethers provider from the wallet provider
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      // This will trigger the wallet popup for signing
      const txResponse = await signer.sendTransaction({
        to: TxData.to,
        value: TxData.value,
        gasLimit: TxData.gasLimit,
        gasPrice: TxData.gasPrice,
        nonce: TxData.nonce,
        chainId: TxData.chainId,
      });

      toast.success('Transaction Signed & Sent!', {
        description: `Hash: ${txResponse.hash}`,
        action: {
          label: 'Copy Hash',
          onClick: () => {
            navigator.clipboard.writeText(txResponse.hash).then(() => {
              toast.success('Transaction hash copied!');
            });
          },
        },
      });

      // Wait for confirmation
      const receipt = await txResponse.wait();

      if (receipt?.status === 1) {
        toast.success('Transaction Confirmed!', {
          description: `Block: ${receipt.blockNumber}`,
        });
      } else {
        toast.error('Transaction failed');
      }
    } catch (err: any) {
      console.error('Transaction error:', err);

      // Handle user rejection
      if (err.code === 4001 || err.message?.includes('User rejected')) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Transaction Failed', {
          description:
            err.reason || err.message || 'Failed to execute transaction',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getChainName = (chainId: number) => {
    const chains: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon',
      80001: 'Mumbai Testnet',
      56: 'BSC',
      97: 'BSC Testnet',
      43114: 'Avalanche',
      43113: 'Fuji Testnet',
      250: 'Fantom',
      4002: 'Fantom Testnet',
      42161: 'Arbitrum One',
      421614: 'Arbitrum Sepolia',
      10: 'Optimism',
      11155420: 'Optimism Sepolia',
      8453: 'Base',
      84532: 'Base Sepolia',
    };
    return chains[chainId] || `Chain ID ${chainId}`;
  };

  const getNativeTokenSymbol = (chainId: number) => {
    const symbols: { [key: number]: string } = {
      1: 'ETH',
      11155111: 'ETH',
      137: 'MATIC',
      80001: 'MATIC',
      56: 'BNB',
      97: 'BNB',
      43114: 'AVAX',
      43113: 'AVAX',
      250: 'FTM',
      4002: 'FTM',
      42161: 'ETH',
      421614: 'ETH',
      10: 'ETH',
      11155420: 'ETH',
      8453: 'ETH',
      84532: 'ETH',
    };
    return symbols[chainId] || 'ETH';
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200 shadow-lg">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-blue-400">
          Transfer {getNativeTokenSymbol(chainId)} Transaction
        </h3>
        <p className="text-zinc-400">{message}</p>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2 text-xs">
        <div
          className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
        ></div>
        <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
          {isConnected
            ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
            : 'Wallet not connected'}
        </span>
      </div>

      {/* Transaction Summary */}
      <div className="space-y-2">
        <h4 className="font-semibold text-zinc-300">Transaction Summary</h4>
        <div className="space-y-1 text-zinc-400">
          <p>
            <span className="text-zinc-500">Network:</span>{' '}
            <span className="font-medium text-white">
              {getChainName(chainId)}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">From:</span>{' '}
            <span className="font-mono text-xs break-all text-white">
              {sender}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">To:</span>{' '}
            <span className="font-mono text-xs break-all text-white">
              {recipient}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">Amount:</span>{' '}
            <span className="font-medium text-white">
              {amount} {getNativeTokenSymbol(chainId)}
            </span>
          </p>
        </div>
      </div>

      {/* Raw Transaction Data */}
      <div>
        <h4 className="flex items-center justify-between font-semibold text-zinc-300">
          Transaction Object
          <Button
            variant="ghost"
            className="px-2 py-0 text-xs hover:bg-zinc-800"
            onClick={() => setShowRaw(!showRaw)}
          >
            {showRaw ? 'Hide' : 'Show'}
          </Button>
        </h4>
        {showRaw && (
          <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-800 p-2 text-xs break-words whitespace-pre-wrap text-yellow-300">
            {JSON.stringify(
              TxData,
              (key, value) =>
                typeof value === 'bigint' ? value.toString() : value,
              2,
            )}
          </pre>
        )}
      </div>

      {/* Serialized Transaction */}
      <div>
        <h4 className="flex items-center justify-between font-semibold text-zinc-300">
          Serialized Transaction
          <Button
            variant="ghost"
            className="px-2 py-0 text-xs hover:bg-zinc-800"
            onClick={() => setShowSerialized(!showSerialized)}
          >
            {showSerialized ? 'Hide' : 'Show'}
          </Button>
        </h4>
        {showSerialized && (
          <div className="mt-2 rounded-md bg-zinc-800 p-2">
            <p className="font-mono text-xs break-all text-green-300">
              {serializedTx}
            </p>
          </div>
        )}
      </div>

      {/* Sign Button */}
      <Button
        className="w-full bg-blue-500 transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-zinc-600"
        onClick={handleSignTransaction}
        disabled={isLoading || !isConnected}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Processing...
          </div>
        ) : !isConnected ? (
          'Connect Wallet to Sign'
        ) : (
          'Sign & Send Transaction'
        )}
      </Button>

      {/* Warning */}
      <p className="text-center text-xs text-zinc-500">
        Clicking the button above will open your wallet to sign and broadcast
        this transaction
      </p>
    </div>
  );
};
