import { PrismaClient, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const db = new PrismaClient({ log: ['error', 'info', 'query', 'warn'] });
export default db;

export const genId = () => uuidv4();
