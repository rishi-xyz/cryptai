'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Hexagon } from '@/src/components/globals/hexagon';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const MarketingHero = () => {
  return (
    <section className="overflow-x-clip py-24 md:py-52">
      <div className="mx-auto w-full max-w-7xl px-4 text-center">
        <p className="text-2xl font-extrabold tracking-wider text-zinc-400">
          Introducing CryptAI
        </p>
        <h1 className="mt-10 text-5xl font-black uppercase md:text-6xl">
          AI Agent that interacts with blockchain
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold text-zinc-500 md:text-2xl">
          Chat with the Blockchain.
        </p>

        {/* Button */}
        <div className="z-0 mt-20 flex justify-center">
          <Link href={'/chat'}>
            <Button
              variant="fushia"
              size="default"
              className="border-2 border-fuchsia-500/30 hover:cursor-pointer hover:border-fuchsia-500 hover:bg-fuchsia-500/30"
            >
              Start Now
            </Button>
          </Link>
        </div>

        {/* Hexagons */}
        <div className="relative -z-30 mt-24 flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.6] md:scale-100 xl:scale-110">
            <Hexagon
              size={300}
              className="size-[300px] md:size-[700px]"
              reverse
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7] md:scale-100 xl:scale-125">
            <Hexagon size={500} className="size-[500px] md:size-[900px]" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.75] md:scale-100 xl:scale-150">
            <Hexagon size={700} className="size-[700px] md:size-[1100px]" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.8] md:scale-100 xl:scale-[1.75]">
            <Hexagon
              size={900}
              className="size-[900px] md:size-[1800px]"
              reverse
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-96 flex flex-col items-center justify-center gap-4 md:mt-80">
          <div className="mb-5 inline-flex h-12 w-5 justify-center rounded-full pt-2 outline-[6px] outline-fuchsia-500/10">
            <motion.div
              animate={{ translateY: 12, opacity: 0.2 }}
              transition={{
                duration: 4,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="h-3 w-1 rounded-full bg-fuchsia-500"
            />
          </div>
          <p className="font-extrabold tracking-wider text-zinc-500 uppercase">
            Scroll to Learn More
          </p>
        </div>
      </div>
    </section>
  );
};
