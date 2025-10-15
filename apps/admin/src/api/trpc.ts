import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@dogtor/trpc'

// 在浏览器环境中避免使用 process.env
const TRPC_URL = 'http://localhost:3000/trpc'

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: TRPC_URL }),
  ],
})