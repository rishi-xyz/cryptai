import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/src/components/ui/sonner';
import ContextProvider from '@/src/context';
import { headers } from 'next/headers';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'CryptAI',
  description: 'Talk to blockchain in Natural Language',
  icons: '/robot.png',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} antialiased`}
        suppressHydrationWarning
      >
        <ContextProvider cookies={cookies}>
          <Toaster position={'bottom-right'} />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
