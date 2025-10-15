import { initTRPC } from '@trpc/server'
import { HealthDto, UserCreateDto, UserListQueryDto } from '@dogtor/dto'
import { createTRPCProxyClient } from '@trpc/client'

// 仅声明结构以避免对 prisma 包的编译时依赖
export type Context = { prisma: any }

const t = initTRPC.context<Context>().create()

export const appRouter = t.router({
  // 健康检查
  health: t.procedure.query(() => HealthDto.parse({ ok: true })),

  // 用户相关路由
  users: t.router({
    // 查询列表
    list: t.procedure
      .input(UserListQueryDto.optional())
      .query(async ({ ctx, input }) => {
        const users = await ctx.prisma.user.findMany({ take: input?.take ?? 10 })
        return { users }
      }),

    // 创建用户
    create: t.procedure
      .input(UserCreateDto)
      .mutation(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.create({
          data: { email: input.email, name: input.name },
        })
        return { user }
      }),
  }),
})

export type AppRouter = typeof appRouter

export const createTRPCClient = (opts: Parameters<typeof createTRPCProxyClient<AppRouter>>[0])=>{
  return createTRPCProxyClient<AppRouter>({...opts})
}
