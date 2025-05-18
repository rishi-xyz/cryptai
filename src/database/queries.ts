import { User } from "@/prisma/generated/prisma";
import { client } from "./prisma";

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

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await client.user.findMany({
      where: {
        email: email
      }
    });
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}