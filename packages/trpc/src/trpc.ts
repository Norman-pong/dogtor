import { initTRPC } from '@trpc/server'
import type { Context } from './types'

// Centralized TRPC builder so modules can share the same instance and Context
export const t = initTRPC.context<Context>().create()


