import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
    }
    prisma = global.prisma;
}

export default prisma;

declare global {
    var prisma: PrismaClient;
}