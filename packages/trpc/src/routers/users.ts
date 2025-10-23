import { UserCreateDto, UserDto, UserListQueryDto } from "@dogtor/dto";
import { t } from "../trpc";

export const usersRouter = t.router({
  // 查询列表
  list: t.procedure
    .input(UserListQueryDto.optional())
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({ take: input?.take ?? 10 });
      return { users: users.map((u) => UserDto.parse(u)) };
    }),

  // 创建用户
  create: t.procedure.input(UserCreateDto).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.create({
      data: { email: input.email, name: input.name },
    });
    return { user: UserDto.parse(user) };
  }),
});
