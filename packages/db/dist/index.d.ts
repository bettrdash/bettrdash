import "dotenv-safe/config";
export * from "@prisma/client";
import { PrismaClient } from "@prisma/client";
declare let prisma: PrismaClient;
declare global {
    var __db: PrismaClient | undefined;
}
export { prisma };
//# sourceMappingURL=index.d.ts.map