import type { NextRequest } from 'next/server';
import type { AuthAction } from 'next-auth';
import type { Session } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/chat',
  },
  providers: [],
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: { user?: Session["user"] } | null;
      request: NextRequest;
      action: AuthAction;
    }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith('/');
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isCron = nextUrl.pathname.endsWith('/cron');

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl));
      }

      if (isOnRegister || isOnLogin || isCron) {
        return true;
      }

      if (isOnChat) {
        return isLoggedIn;
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
};
