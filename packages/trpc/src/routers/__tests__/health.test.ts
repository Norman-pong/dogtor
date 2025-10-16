import { describe, expect, test } from 'vitest'
import { appRouter } from '../../router'
import { t } from '../../trpc'

describe('health router', () => {
  test('returns ok', async () => {
    const createCaller = t.createCallerFactory(appRouter)
    const caller = createCaller({ prisma: {} })
    const res = await caller.health()
    expect(res).toEqual({ ok: true })
  })
})