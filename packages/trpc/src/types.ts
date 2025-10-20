import type { PrismaClient } from '@prisma/client';
import type { Context as HonoContext } from 'hono';
export type HealthResponse = { ok: true };
export type Context = { prisma: PrismaClient; hono?: HonoContext };
