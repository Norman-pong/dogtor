import type { D1Database } from "@cloudflare/workers-types";
import type { Context as TrpcContext } from "@dogtor/trpc";
import type { UserCreateDto, UserDto } from "@dogtor/dto";
import type { Context as HonoContext } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { users } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export const createContext = (c: HonoContext): TrpcContext => {
  const d1 = c.env.DB as D1Database;
  const db = drizzle(d1);

  const adapter: TrpcContext["db"] = {
    user: {
      findMany: async (opts?: { take?: number }): Promise<UserDto[]> => {
        const limit = opts?.take ?? 100;
        const rows = await db
          .select()
          .from(users)
          .orderBy(desc(users.id))
          .limit(limit)
          .all();
        return rows.map((r) => ({
          id: r.id!,
          email: r.email!,
          name: r.name ?? undefined,
          createdAt: r.createdAt!,
        }));
      },
      create: async (opts: { data: UserCreateDto }): Promise<UserDto> => {
        const { email, name } = opts.data;
        await db
          .insert(users)
          .values({ email, name: name ?? null })
          .run();
        const created = (
          await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .all()
        )[0]!;
        return {
          id: created.id!,
          email: created.email!,
          name: created.name ?? undefined,
          createdAt: created.createdAt!,
        };
      },
    },
  };

  return { db: adapter, hono: c };
};
