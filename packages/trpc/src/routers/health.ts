import { HealthDto } from '@dogtor/dto';

import { t } from '../trpc';

// Keep API shape: health is a procedure, not a sub-router

export const health = t.procedure.query(() => HealthDto.parse({ ok: true }));
