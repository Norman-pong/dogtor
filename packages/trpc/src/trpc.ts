import { initTRPC } from '@trpc/server'
import type { Context } from './types'
export const t = initTRPC.context<Context>().create()


