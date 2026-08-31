import { type UIMessage } from 'ai';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { getChatById } from '@/src/database/queries';
import { convertToUIMessages } from '@/src/lib/utils';
import { Chat as ViewChat } from '@/src/components/platform/chat';
import { cookies } from 'next/headers';
import { DEFAULT_MODEL_NAME, models } from '@/src/ai/models';

export default async function Page({ params }: { params: any }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  if (session.user.id !== chatFromDb.userId) {
    return notFound();
  }

  const storedMessages = (chatFromDb.messages as Array<unknown>) || [];

  const initialMessages: Array<UIMessage> =
    storedMessages.length > 0 &&
    typeof (storedMessages[0] as { parts?: unknown } | null)?.parts !==
      'undefined'
      ? (storedMessages as Array<UIMessage>)
      : convertToUIMessages(storedMessages as Array<never>);

  return (
    <ViewChat
      id={chatFromDb.id}
      initialMessages={initialMessages}
      selectedModelId={selectedModelId}
      isReadonly={session.user.id !== chatFromDb.userId}
    />
  );
}
