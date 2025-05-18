import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'SuiGpt',
  description: 'Talk to SUI blockchain in Natural Language',
};

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
