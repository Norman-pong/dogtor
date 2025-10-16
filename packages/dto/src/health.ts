import { z } from 'zod'

// DTO: 健康检查响应（可扩展）
export const HealthDto = z.object({ ok: z.literal(true) })
export type HealthDto = z.infer<typeof HealthDto>