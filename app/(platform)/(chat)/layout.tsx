import { AppSidebar } from "@/src/components/chat/sidebar";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import React from "react";

export default function ChatLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}