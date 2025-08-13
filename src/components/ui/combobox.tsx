'use client';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { toast } from 'sonner';
import { mainnet, monadTestnet, sepolia, solana } from '@reown/appkit/networks';
import {
  createAppKit,
  useAppKitNetwork,
  useAppKit,
  useAppKitAccount,
} from '@reown/appkit/react';
import { chainsI } from '@/src/types/chains';
import { modal } from '@/src/context';
import { useWalletStore } from '@/src/store/wallet-store';

const chains: chainsI[] = [
  {
    id: sepolia.id,
    value: 'Sepolia',
    label: sepolia.name,
    namespace: 'eip155',
    caipNetwork: sepolia,
  },
  {
    id: monadTestnet.id,
    value: 'Monad Testnet',
    label: monadTestnet.name,
    namespace: 'eip155',
    caipNetwork: monadTestnet,
  },
  {
    id: Number(solana.id),
    value: 'Solana',
    label: solana.name,
    namespace: solana.chainNamespace,
    caipNetwork: solana,
    developemnt: true,
  },
  {
    id: mainnet.id,
    value: 'Ethereum',
    label: mainnet.name,
    namespace: 'eip155',
    caipNetwork: mainnet,
    developemnt: true,
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  createAppKit(modal);
  const { caipNetwork, switchNetwork } = useAppKitNetwork();
  const { open: openModal } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  const setWalletData = useWalletStore((state) => state.setWalletData);

  React.useEffect(() => {
    if (isConnected && address && caipNetwork) {
      const chainId = caipNetwork?.id
        ? parseInt(
            String(caipNetwork.id).split(':').pop() || String(caipNetwork.id),
            10,
          )
        : 1;
      const chainName = caipNetwork?.name || null;

      setWalletData({
        address,
        chainId,
        chainName,
      });
    }
  }, [caipNetwork, address, isConnected, setWalletData]);

  React.useEffect(() => {
    if (caipNetwork) {
      const currentChain = chains.find(
        (chain) =>
          chain.caipNetwork.id === caipNetwork.id ||
          chain.id === caipNetwork.id,
      );
      if (currentChain) {
        setValue(currentChain.value);
      }
    }
  }, [caipNetwork]);

  const handleSolanaSwitch = async (selectedChain: chainsI) => {
    try {
      // For Solana, we need to ensure the user has a Solana-compatible wallet
      // First, try to open the wallet modal to connect a Solana wallet
      if (caipNetwork?.chainNamespace !== 'solana') {
        toast('Switching to Solana', {
          description:
            'Please connect a Solana-compatible wallet (Phantom, Solflare, etc.)',
          duration: 3000,
        });

        // Open wallet modal to allow user to connect Solana wallet
        openModal();
        return false;
      }

      await switchNetwork(selectedChain.caipNetwork);

      // Update store immediately after successful switch
      if (address) {
        const chainId = selectedChain.caipNetwork?.id
          ? parseInt(
              String(selectedChain.caipNetwork.id).split(':').pop() ||
                String(selectedChain.caipNetwork.id),
              10,
            )
          : selectedChain.id;

        setWalletData({
          address,
          chainId,
          chainName: selectedChain.label,
        });
      }

      toast('Network switched successfully', {
        description: `Switched to ${selectedChain.label}`,
        duration: 3000,
      });

      return true;
    } catch (error: any) {
      console.error('Solana switch error:', error);

      // Handle specific Solana errors
      if (error.message?.includes('wallet')) {
        toast('Wallet not compatible', {
          description:
            'Please connect a Solana-compatible wallet (Phantom, Solflare, Backpack)',
          duration: 5000,
        });
      } else if (error.message?.includes('user rejected')) {
        toast('Network switch cancelled', {
          description: 'User cancelled the network switch',
          duration: 3000,
        });
      } else {
        toast('Failed to switch to Solana', {
          description:
            error.message ||
            'Unknown error occurred. Make sure you have a Solana wallet connected.',
          duration: 5000,
        });
      }

      return false;
    }
  };

  const handleEVMSwitch = async (selectedChain: chainsI) => {
    try {
      await switchNetwork(selectedChain.caipNetwork);

      // Update store immediately after successful switch
      if (address) {
        const chainId = selectedChain.caipNetwork?.id
          ? parseInt(
              String(selectedChain.caipNetwork.id).split(':').pop() ||
                String(selectedChain.caipNetwork.id),
              10,
            )
          : selectedChain.id;

        setWalletData({
          address,
          chainId,
          chainName: selectedChain.label,
        });
      }

      toast('Network switched successfully', {
        description: `Switched to ${selectedChain.label}`,
        duration: 3000,
      });

      return true;
    } catch (error: any) {
      console.error('EVM switch error:', error);

      if (error.code === 4902) {
        // Network not added to wallet
        toast('Network not found', {
          description: `Please add ${selectedChain.label} to your wallet first`,
          duration: 5000,
        });
      } else if (error.code === 4001) {
        // User rejected the request
        toast('Network switch cancelled', {
          description: 'User cancelled the network switch',
          duration: 3000,
        });
      } else {
        toast(`Failed to switch to ${selectedChain.label}`, {
          description: error.message || 'Please check your wallet connection',
          duration: 5000,
        });
      }

      return false;
    }
  };

  const selectHandler = async (currentValue: string) => {
    const selectedChain = chains.find((ch) => ch.value === currentValue);
    if (!selectedChain) return;

    // Don't switch if already on the selected network
    if (selectedChain.caipNetwork.id === caipNetwork?.id) {
      setValue(currentValue);
      setOpen(false);
      return;
    }

    setIsLoading(true);
    setOpen(false);

    try {
      let success = false;

      if (selectedChain.namespace === 'solana') {
        success = await handleSolanaSwitch(selectedChain);
      } else {
        success = await handleEVMSwitch(selectedChain);
      }

      if (success) {
        setValue(currentValue);
      } else {
        // Reset to current network if switch failed
        const currentChain = chains.find(
          (chain) => chain.caipNetwork.id === caipNetwork?.id,
        );
        if (currentChain) {
          setValue(currentChain.value);
        }
      }
    } catch (error) {
      console.error('Unexpected error during network switch:', error);
      toast('Unexpected error', {
        description: 'An unexpected error occurred while switching networks',
        duration: 5000,
      });

      // Reset to current network
      const currentChain = chains.find(
        (chain) => chain.caipNetwork.id === caipNetwork?.id,
      );
      if (currentChain) {
        setValue(currentChain.value);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          {isLoading
            ? 'Switching...'
            : value
              ? chains.find((chain) => chain.value === value)?.label
              : 'Select Chain'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search chain..." className="h-9" />
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {chains.map((chain) => (
                <CommandItem
                  key={chain.value}
                  value={chain.value}
                  onSelect={selectHandler}
                  disabled={isLoading || chain.developemnt} // disable if coming soon
                >
                  <span className="flex items-center gap-2">
                    {chain.label}
                    {chain.developemnt && (
                      <span className="text rounded-full bg-white px-2 py-0.5 text-red-800">
                        Coming Soon
                      </span>
                    )}
                  </span>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === chain.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
