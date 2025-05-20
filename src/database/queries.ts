import { User } from '@/prisma/generated/prisma';
import { client } from './prisma';
import { genSaltSync, hashSync } from 'bcrypt-ts';

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  client.chat
    .update({
      where: {
        id: chatId,
      },
      data: {
        visibility,
      },
    })
    .then((res) => {
      return { res };
    })
    .catch((err) => {
      throw new Error(`Failed to update chat visibility, ${err}`);
    });
}

export async function getUser(email: string): Promise<User[]> {
  try {
    return await client.user.findMany({ where: { email } });
  } catch (error) {
    console.error('Failed to get user from database', error);
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  try {
    return await client.user.create({ data: { email, password: hash } });
  } catch (error) {
    console.error('Failed to create user in database', error);
    throw error;
  }
}

export async function createUserWithOauth(email: string) {
  const salt = genSaltSync(10);
  try {
    return await client.user.create({ data: { email } });
  } catch (error) {
    console.error('Failed to create user in database', error);
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await client.chat.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to get chats by user from database', error);
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    return await client.chat.findUnique({ where: { id } });
  } catch (error) {
    console.error('Failed to get chat by id from database', error);
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await client.chat.delete({ where: { id } });
  } catch (error) {
    console.error('Failed to delete chat by id from database', error);
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const chatExists = await client.chat.findUnique({ where: { id } });
    if (chatExists) {
      return await client.chat.update({ where: { id }, data: { messages } });
    }

    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error(`User with ID ${userId} does not exist.`);
      throw new Error(`Cannot create chat: User not found.`);
    }

    return await client.chat.create({
      data: {
        id,
        messages,
        userId,
        title: 'new Chat',
      },
    });
  } catch (error) {
    console.error('Failed to save chat in database', error);
    throw error;
  }
}
