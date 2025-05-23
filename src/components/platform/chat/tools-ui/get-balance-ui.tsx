'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/src/components/ui/card';
import { CoinsIcon } from 'lucide-react';

type BalanceResult = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
};

export function GetBalance({
  RecievedResult,
}: {
  RecievedResult?: { balances: BalanceResult[]; error?: string };
}) {
  const { balances, error } = RecievedResult!;

  if (error) {
    return (
      <div className="text-sm text-red-400">
        ⚠️ Error fetching balance: {error}
      </div>
    );
  }

  if (!balances || balances.length === 0) {
    return (
      <div className="text-sm text-zinc-400">
        No balances found for this address.
      </div>
    );
  }

  return (
    <motion.div
      className="flex w-full flex-col gap-4 pt-2"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {balances.map((coin: any) => (
        <Card
          key={coin.address}
          className="border border-zinc-700 bg-zinc-900 text-zinc-200"
        >
          <CardContent className="flex flex-col gap-2 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <CoinsIcon className="h-4 w-4 text-fuchsia-500" />
                {coin.name} ({coin.symbol})
              </div>
              <div className="max-w-[100px] truncate text-right text-sm text-zinc-400">
                {coin.address.slice(0, 8)}...{coin.address.slice(-6)}
              </div>
            </div>
            <div className="text-base">
              Balance: <span className="text-fuchsia-400">{coin.balance}</span>
            </div>
            <div className="text-xs text-zinc-500">
              Decimals: {coin.decimals}
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}
