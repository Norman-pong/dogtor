import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@dogtor/trpc";
import { createContext as createTrpcContext } from "./context";
import type { D1Database } from "@cloudflare/workers-types";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.use("*", cors());
app.get("/", (c) => c.json({ ok: true }));
// tRPC 挂载
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => createTrpcContext(c),
  }),
);

export default {
  fetch: app.fetch,
};
