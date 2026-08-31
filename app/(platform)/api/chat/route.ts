import { auth } from '@/app/(auth)/auth';
import { openRouterProModel } from '@/src/ai';
import { systemInstructions } from '@/src/ai/system-instructions';
import { ALLTools } from '@/src/ai/tools';
import { saveChat } from '@/src/database/queries';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<UIMessage> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = await streamText({
    model: openRouterProModel,
    system: systemInstructions,
    messages: modelMessages,
    onError: (err) => {
      console.log(err.error);
    },
    tools: ALLTools,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ messages: uiMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: uiMessages,
            userId: session.user.id,
          });
        } catch (error) {
          console.error('Failed to save chat', error);
        }
      }
    },
  });
}
