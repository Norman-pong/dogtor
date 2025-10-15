import type { Context } from "hono";
import { PrismaClient } from "@prisma/client";

export type TrpcContext = {
  prisma: PrismaClient;
  hono: Context;
};

let prismaClient: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

export const createContext = async (c: Context): Promise<TrpcContext> => {
  return { prisma: getPrisma(), hono: c };
};


