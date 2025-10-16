import { z } from 'zod'

// DTO: 创建用户
export const UserCreateDto = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
})
export type UserCreateDto = z.infer<typeof UserCreateDto>

// DTO: 查询用户列表（限制返回数量）
export const UserListQueryDto = z.object({
  take: z.number().int().positive().max(100).default(10),
})
export type UserListQueryDto = z.infer<typeof UserListQueryDto>