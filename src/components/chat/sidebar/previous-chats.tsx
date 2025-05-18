'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '../../ui/sidebar';
import useSWR from 'swr';
import { Chat } from '@/prisma/generated/prisma';
import { useSession } from 'next-auth/react';
import { dataFetcher } from '@/src/lib/utils';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GroupedChats } from '@/src/types/grouped-chats';
import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import { useChatVisibility } from '@/src/hooks/use-chat-visibility';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
    CheckCheckIcon,
    CheckCircle2Icon,
    GlobeIcon,
    LockIcon,
    MoreHorizontalIcon,
    ShareIcon,
    TrashIcon,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../../ui/alert-dialog';

const PureChatItem = ({
    chat,
    isActive,
    onDelete,
    setOpenMobile,
}: {
    chat: Chat;
    isActive: boolean;
    onDelete: (chatId: string) => void;
    setOpenMobile: (open: boolean) => void;
}) => {
    const { visibilityType, setVisibilityType } = useChatVisibility({
        chatId: chat.id,
        initialVisibility: chat.visibility,
    });

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive}>
                <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
                    <span>{chat.title}</span>
                </Link>
            </SidebarMenuButton>

            <DropdownMenu modal={true}>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
                        showOnHover={!isActive}
                    >
                        <MoreHorizontalIcon />
                        <span className="sr-only">More</span>
                    </SidebarMenuAction>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                            <ShareIcon />
                            <span>Share</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem
                                    className="cursor-pointer flex-row justify-between"
                                    onClick={() => {
                                        setVisibilityType('private');
                                    }}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <LockIcon size={12} />
                                        <span>Private</span>
                                    </div>
                                    {visibilityType === 'private' ? <CheckCircle2Icon /> : null}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer flex-row justify-between"
                                    onClick={() => {
                                        setVisibilityType('public');
                                    }}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <GlobeIcon />
                                        <span>Public</span>
                                    </div>
                                    {visibilityType === 'public' ? <CheckCheckIcon /> : null}
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/15 focus:text-destructive cursor-pointer dark:text-red-500"
                        onSelect={() => onDelete(chat.id)}
                    >
                        <TrashIcon />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
    if (prevProps.isActive !== nextProps.isActive) return false;
    return true;
});

const PreviousChat = () => {
    //get user
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const { setOpenMobile } = useSidebar();
    //get chat id from params
    const { chatId } = useParams();
    //get pathname
    const pathname = usePathname();
    //set id to delete
    const [deletingId, setDeletingId] = useState<string | null>(null);
    //set dialog for deleting
    const [DeleteDialog, setDeleteDialog] = useState(false);
    //swr for data fetching , empty array as fallback
    const {
        data: history,
        isLoading,
        mutate,
    } = useSWR<Array<Chat>>(user ? `/api/chat/history` : null, dataFetcher, {
        fallbackData: [],
    });
    //refresh every time site loads and reloads
    useEffect(() => {
        mutate();
    }, [pathname, mutate]);
    //api call to delete chat
    const groupChats = (chats: Chat[] = []): GroupedChats => {
        const now = new Date();
        const oneWeekAgo = subWeeks(now, 1);
        const oneMonthAgo = subMonths(now, 1);

        return chats.reduce(
            (groups, chat) => {
                const chatDate = new Date(chat.createdAt);
                if (isToday(chatDate)) {
                    groups.today.push(chat);
                } else if (isYesterday(chatDate)) {
                    groups.yesterday.push(chat);
                } else if (chatDate > oneWeekAgo) {
                    groups.lastWeek.push(chat);
                } else if (chatDate > oneMonthAgo) {
                    groups.lastMonth.push(chat);
                } else {
                    groups.older.push(chat);
                }
                return groups;
            },
            {
                today: [],
                yesterday: [],
                lastWeek: [],
                lastMonth: [],
                older: [],
            } as GroupedChats,
        );
    };

    const handleDelete = async () => {
        const deleteHandle = fetch(`/api/chat/delete?id=${deletingId}`, {
            method: 'DELETE',
        });
        //await toast on response of call
        toast.promise(deleteHandle, {
            loading: 'Deleting Chat...',
            success: () => {
                mutate((history) => {
                    if (history) {
                        return history.filter((h) => h.id !== chatId);
                    }
                });
                return 'Chat deleted sucessfully';
            },
            error: 'Failed to delete chat',
        });
        //set the delete dialog and push to new chat if user is on the deleted chat
        setDeleteDialog(false);
        if (deletingId === chatId) {
            router.push('/chat');
        }
    };
    //if user hasn't logged in
    if (!user) {
        return (
            <SidebarGroup>
                <SidebarGroupContent>
                    <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
                        Login to see your previous chat
                    </div>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }
    //if chat are still loading
    if (isLoading) {
        return (
            <SidebarGroup>
                <SidebarGroupContent>
                    <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
                        Loading...
                    </div>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }
    //if no previous chat history
    if (history?.length === 0) {
        return (
            <SidebarGroup>
                <SidebarGroupContent>
                    <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
                        No previous chats
                    </div>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel className="flex items-center justify-center">
                    <div className="text-lg font-semibold">Chat History</div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {history &&
                            (() => {
                                const groupedChats = groupChats(
                                    Array.isArray(history) ? history : [],
                                );

                                return (
                                    <>
                                        {groupedChats.today.length > 0 && (
                                            <>
                                                <div className="text-sidebar-foreground/50 px-2 py-1 text-xs">
                                                    Today
                                                </div>
                                                {groupedChats.today.map((chat) => (
                                                    <ChatItem
                                                        key={chat.id}
                                                        chat={chat}
                                                        isActive={chat.id === chatId}
                                                        onDelete={(chatId: string) => {
                                                            setDeletingId(chatId);
                                                            setDeleteDialog(true);
                                                        }}
                                                        setOpenMobile={setOpenMobile}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {groupedChats.yesterday.length > 0 && (
                                            <>
                                                <div className="text-sidebar-foreground/50 mt-6 px-2 py-1 text-xs">
                                                    Yesterday
                                                </div>
                                                {groupedChats.yesterday.map((chat) => (
                                                    <ChatItem
                                                        key={chat.id}
                                                        chat={chat}
                                                        isActive={chat.id === chatId}
                                                        onDelete={(chatId) => {
                                                            setDeletingId(chatId);
                                                            setDeleteDialog(true);
                                                        }}
                                                        setOpenMobile={setOpenMobile}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {groupedChats.lastWeek.length > 0 && (
                                            <>
                                                <div className="text-sidebar-foreground/50 mt-6 px-2 py-1 text-xs">
                                                    Last 7 days
                                                </div>
                                                {groupedChats.lastWeek.map((chat) => (
                                                    <ChatItem
                                                        key={chat.id}
                                                        chat={chat}
                                                        isActive={chat.id === chatId}
                                                        onDelete={(chatId) => {
                                                            setDeletingId(chatId);
                                                            setDeleteDialog(true);
                                                        }}
                                                        setOpenMobile={setOpenMobile}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {groupedChats.lastMonth.length > 0 && (
                                            <>
                                                <div className="text-sidebar-foreground/50 mt-6 px-2 py-1 text-xs">
                                                    Last 30 days
                                                </div>
                                                {groupedChats.lastMonth.map((chat) => (
                                                    <ChatItem
                                                        key={chat.id}
                                                        chat={chat}
                                                        isActive={chat.id === chatId}
                                                        onDelete={(chatId) => {
                                                            setDeletingId(chatId);
                                                            setDeleteDialog(true);
                                                        }}
                                                        setOpenMobile={setOpenMobile}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {groupedChats.older.length > 0 && (
                                            <>
                                                <div className="text-sidebar-foreground/50 mt-6 px-2 py-1 text-xs">
                                                    Older
                                                </div>
                                                {groupedChats.older.map((chat) => (
                                                    <ChatItem
                                                        key={chat.id}
                                                        chat={chat}
                                                        isActive={chat.id === chatId}
                                                        onDelete={(chatId) => {
                                                            setDeletingId(chatId);
                                                            setDeleteDialog(true);
                                                        }}
                                                        setOpenMobile={setOpenMobile}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <AlertDialog open={DeleteDialog} onOpenChange={setDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            chat and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export { PreviousChat };
