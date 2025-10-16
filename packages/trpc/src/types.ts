// Shared DTOs/Zod schemas can be re-exported here later
export type HealthResponse = { ok: true }

// TRPC context type shared across modules
export type Context = { prisma: any; hono?: unknown }