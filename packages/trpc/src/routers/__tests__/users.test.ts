import { describe, expect, test, vi, afterEach } from 'vitest'
import { appRouter } from '../../router'
import { t } from '../../trpc'

function createCtx() {
  return {
    prisma: {
      user: {
        findMany: vi.fn(),
        create: vi.fn(),
      },
    },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('users router', () => {
  test('list returns users with provided take', async () => {
    const ctx = createCtx()
    ctx.prisma.user.findMany.mockResolvedValue([
      { id: 1, email: 'a@x.com', name: 'A' },
    ])

    const createCaller = t.createCallerFactory(appRouter)
    const caller = createCaller(ctx)
    const res = await caller.users.list({ take: 1 })

    expect(ctx.prisma.user.findMany).toHaveBeenCalledWith({ take: 1 })
    expect(res.users).toHaveLength(1)
    expect(res.users[0]).toMatchObject({ email: 'a@x.com', name: 'A' })
  })

  test('list uses default take when input is undefined', async () => {
    const ctx = createCtx()
    ctx.prisma.user.findMany.mockResolvedValue([])

    const createCaller = t.createCallerFactory(appRouter)
    const caller = createCaller(ctx)
    const res = await caller.users.list(undefined)

    expect(ctx.prisma.user.findMany).toHaveBeenCalledWith({ take: 10 })
    expect(res.users).toHaveLength(0)
  })

  test('list rejects invalid input', async () => {
    const createCaller = t.createCallerFactory(appRouter)
    const caller = createCaller(createCtx())
    await expect(caller.users.list({ take: -1 })).rejects.toThrow()
  })

  test('create returns created user', async () => {
    const ctx = createCtx()
    ctx.prisma.user.create.mockResolvedValue({
      id: 2, email: 'b@x.com', name: 'B',
    })

    const createCaller = t.createCallerFactory(appRouter)
    const caller = createCaller(ctx)
    const res = await caller.users.create({ email: 'b@x.com', name: 'B' })

    expect(ctx.prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'b@x.com', name: 'B' },
    })
    expect(res.user).toMatchObject({ email: 'b@x.com', name: 'B' })
  })
})