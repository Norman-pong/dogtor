import { t } from './trpc';
import { health } from './routers/health';
import { usersRouter } from './routers/users';

export const appRouter = t.router({
  health,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
