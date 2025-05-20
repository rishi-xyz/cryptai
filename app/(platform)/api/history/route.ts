import { auth } from '@/app/(auth)/auth';
import { getChatsByUserId } from '@/src/database/queries';

export async function GET() {
  const session = await auth();
  console.log('Just fine');

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const chats = await getChatsByUserId({ id: session.user.id! });
  return Response.json(chats);
}
