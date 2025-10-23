import type { Context as HonoContext } from "hono";
import type { UserCreateDto, UserDto } from "@dogtor/dto";

export type HealthResponse = { ok: true };

export type DbUserRepository = {
  findMany: (opts?: { take?: number }) => Promise<UserDto[]>;
  create: (opts: { data: UserCreateDto }) => Promise<UserDto>;
};

export type DbContext = {
  user: DbUserRepository;
};

export type Context = { db: DbContext; hono?: HonoContext };
