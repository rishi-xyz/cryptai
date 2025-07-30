import { auth } from '@/app/(auth)/auth';
import { AppSidebar } from '@/src/components/platform/sidebar';
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar';
import ContextProvider from '@/src/context';
import { cookies, headers } from 'next/headers';
import React from 'react';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';
  const headersObj = await headers();
  const cookie = headersObj.get('cookie');
  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={session?.user} />
      <SidebarInset>
        <ContextProvider cookies={cookie}>{children}</ContextProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
