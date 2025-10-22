import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@dogtor/trpc";

// 在浏览器/宿主环境中使用 import.meta.env 读取公开变量；提供回退值
const TRPC_URL: string = "http://100.113.178.17:3000/trpc";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: TRPC_URL })],
});
