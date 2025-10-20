import { z } from 'zod'

export const HealthDto = z.object({ ok: z.literal(true) })
export type HealthDto = z.infer<typeof HealthDto>