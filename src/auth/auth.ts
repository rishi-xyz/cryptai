import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { authConfig } from './auth.config';
import { getUser } from '../database/queries';
import { ExtendedSession, ExtendedUser } from '../interfaces/extended-session';
import { compare } from 'bcrypt-ts';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {},
            async authorize({ email, password }: any) {
                const users = await getUser(email);
                if (users.length === 0) return null;

                // biome-ignore lint: Forbidden non-null assertion.
                const passwordsMatch = await compare(password, users[0].password!);
                if (!passwordsMatch) return null;

                return users[0] as any;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },
        async session({
            session,
            token,
        }) {
            (session.user as ExtendedUser).id = token.id as string;
            return session as ExtendedSession;
        },
    },
});
