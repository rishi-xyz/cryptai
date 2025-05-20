import { CoreMessage } from 'ai';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { getChatById } from '@/src/database/queries';
import { convertToUIMessages } from '@/src/lib/utils';
import { Chat } from '@/prisma/generated/prisma';
import { Chat as ViewChat } from '@/src/components/platform/chat';

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting and converting messages to UI messages
  const chat: Chat = {
    ...chatFromDb,
    messages: JSON.stringify(
      convertToUIMessages((chatFromDb.messages as Array<CoreMessage>) || []),
    ),
  };

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  if (session.user.id !== chat.userId) {
    return notFound();
  }

  const parsedMessage =
    typeof chat.messages === 'string' ? JSON.parse(chat.messages) : null;

  return <ViewChat id={chat.id} initialMessages={parsedMessage} />;
}
