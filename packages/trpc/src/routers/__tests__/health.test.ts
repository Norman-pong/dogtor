import { describe, expect, test } from "vitest";
import { appRouter } from "../../router";
import { t } from "../../trpc";
import type { Context } from "../../types";

describe("health router", () => {
  test("returns ok", async () => {
    const createCaller = t.createCallerFactory(appRouter);
    const caller = createCaller({ prisma: {} as unknown as Context["prisma"] });
    const res = await caller.health();
    expect(res).toEqual({ ok: true });
  });
});
