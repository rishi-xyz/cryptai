import { auth } from '@/app/(auth)/auth';
import { getChatsByUserId } from '@/src/database/queries';

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }
  console.log("Id:",session.user.id)
  const chats = await getChatsByUserId({ id: session.user.id! });
  return Response.json(chats);
}
