import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export class PrismaClientError extends PrismaClientKnownRequestError {}
