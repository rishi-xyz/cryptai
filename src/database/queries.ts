import { User } from "@/prisma/generated/prisma";
import { client } from "./prisma";
import { genSaltSync, hashSync } from "bcrypt-ts";

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
