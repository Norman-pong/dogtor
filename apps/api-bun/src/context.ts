import type { Context } from "hono";
import { PrismaClient } from "@prisma/client";
import { detectLocale, createServerI18n } from "./i18n";

export type TrpcContext = {
  prisma: PrismaClient;
  hono: Context;
  locale: ReturnType<typeof detectLocale>;
  t: (key: string) => string;
};

let prismaClient: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

export const createContext = async (c: Context): Promise<TrpcContext> => {
  const locale = detectLocale(c.req.header('accept-language'));
  const { t } = createServerI18n(locale);
  return { prisma: getPrisma(), hono: c, locale, t };
};


