import { auth } from '@/app/(auth)/auth';
import { geminiProModel } from '@/src/ai';
import { systemInstructions } from '@/src/ai/system-instructions';
import { ALLTools } from '@/src/ai/tools';
import { saveChat } from '@/src/database/queries';
import { convertToCoreMessages, Message, streamText } from 'ai';

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: systemInstructions,
    messages: coreMessages,
    onError: (err) => {
      console.log(err.error);
    },
    onFinish: async ({ response }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...response.messages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error('Failed to save chat', error);
        }
      }
    },
    tools: ALLTools,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({});
}
