import { UserCreateDto, UserListQueryDto } from '@dogtor/dto'
import { t } from '../trpc'

export const usersRouter = t.router({
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
})