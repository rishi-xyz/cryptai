'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { useWallet } from '@suiet/wallet-kit';
import { toast } from 'sonner';
import { Transaction } from '@mysten/sui/transactions';

export const TransferSui = ({
  RecievedResult,
}: {
  RecievedResult?: {
    TxData: any;
    serializedTx: any;
    message: string;
    amount: number;
    recipient: string;
  };
}) => {
  const [showRaw, setShowRaw] = useState(false);
  const wallet = useWallet();

  if (!RecievedResult) return null;

  const { TxData, serializedTx, message, amount, recipient } = RecievedResult;

  const handleApprove = async () => {
    const transaction = Transaction.from(serializedTx);
    wallet
      .signAndExecuteTransaction({
        transaction,
      })
      .then((res) => {
        toast('Transaction Approved', {
          description: `Transaction digest: ${res.digest || 'Success'}`,
          action: {
            label: 'Copy Digest',
            onClick: () => {
              if (res?.digest) {
                navigator.clipboard.writeText(res.digest).then(() => {
                  toast.success('Digest copied to clipboard');
                });
              } else {
                toast.error('Unable to copy transaction digest');
              }
            },
          },
        });
      })
      .catch((err) => {
        console.error('Error signing transaction:', err);
        toast('Error Occurred', {
          description: err.message || 'Failed to execute transaction',
        });
      });
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200 shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-fuchsia-400">
          Transfer SUI Transaction
        </h3>
        <p className="text-zinc-400">{message}</p>
      </div>
      <div>
        <h4 className="flex items-center justify-between font-semibold text-zinc-300">
          Transaction Object (Raw)
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
        <p className="text-zinc-400">
          You are about to send{' '}
          <span className="font-medium text-white">{amount} SUI</span> to the
          address{' '}
          <span className="font-mono text-wrap break-words text-white">
            {recipient}
          </span>
          .
        </p>
      </div>

      <Button
        className="w-full bg-fuchsia-500 transition"
        variant="fushia"
        onClick={handleApprove}
      >
        Approve Transaction
      </Button>
    </div>
  );
};
