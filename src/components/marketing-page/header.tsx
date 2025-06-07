import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Home, Star, Phone } from 'lucide-react';

export const MarketingHeader = () => {
  return (
    <header className="sticky top-3 z-50 m-4 rounded-2xl bg-zinc-900/50 outline-2 outline-fuchsia-500/30 backdrop-blur-sm">
      <div className="container">
        {/* Flex changes: column on small, row on md+ */}
        <div className="flex h-20 flex-col items-center justify-center md:h-20 md:flex-row md:items-center md:justify-between">
          {/* Logo: only visible on md+ */}
          <div className="hidden md:block">
            <h2 className="ml-1 bg-white bg-[radial-gradient(100%_100%_at_top_left,#d946ef,white,rgb(74,32,138,.5))] bg-clip-text text-center text-3xl font-semibold tracking-tighter text-transparent md:ml-5 md:text-4xl md:leading-none">
              CryptAI
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-x-4 md:gap-x-6 lg:ml-66">
            {/* Desktop Text Links */}
            <div className="hidden gap-x-4 md:flex">
              <Link
                href={'#'}
                className="transition-transform hover:text-lg hover:text-fuchsia-500/60"
              >
                Home
              </Link>
              <Link
                href={'#features'}
                className="transition-transform hover:text-lg hover:text-fuchsia-500/60"
              >
                Features
              </Link>
              <Link
                href={'#footer'}
                className="transition-transform hover:text-lg hover:text-fuchsia-500/60"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Icons Centered */}
            <div className="mx-auto flex gap-x-6 md:hidden">
              <Link href={'#'} aria-label="Home">
                <Home className="h-5 w-5 text-white transition-colors hover:text-fuchsia-400" />
              </Link>
              <Link href={'#features'} aria-label="Features">
                <Star className="h-5 w-5 text-white transition-colors hover:text-fuchsia-400" />
              </Link>
              <Link href={'#footer'} aria-label="Contact">
                <Phone className="h-5 w-5 text-white transition-colors hover:text-fuchsia-400" />
              </Link>
            </div>
          </div>

          {/* Launch App Button: only visible on md+ */}
          <div className="hidden md:block">
            <div className="inset-0 rounded-2xl outline-2 outline-offset-2 outline-fuchsia-500/30 hover:bg-fuchsia-500/30">
              <Link href={'/chat'}>
                <Button variant={'fushia'} size={'default'}>
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
