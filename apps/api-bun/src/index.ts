import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from '@dogtor/trpc'
import { UserCreateDto } from '@dogtor/dto'
import { createContext as createTrpcContext } from "./context";

// Avoid TS errors for Bun global without bun-types
declare const Bun: any

const app = new Hono()

// 允许跨域（Admin 开发服在 8080 上）
app.use('*', cors())

// Prevent multiple PrismaClient instances in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma

app.get('/', (c) => c.json({ ok: true }))

// tRPC 挂载
app.use('/trpc/*', trpcServer({
  router: appRouter,
  createContext: (_opts, c) => createTrpcContext(c),
}))
app.get('/users', async (c) => {
  const users = await prisma.user.findMany({ take: 10 })
  return c.json({ users })
})

app.post('/users', async (c) => {
  const body = await c.req.json()
  const parsed = UserCreateDto.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400)
  }
  const user = await prisma.user.create({ data: parsed.data })
  return c.json({ user })
})


// Bun entry
if (typeof Bun !== 'undefined') {
  const port = Number(process.env.PORT ?? 3000)
  Bun.serve({ port, fetch: app.fetch })
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
}