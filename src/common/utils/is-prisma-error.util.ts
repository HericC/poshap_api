import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const isPrismaError = (error: PrismaClientKnownRequestError) => {
  return (
    typeof error.code === 'string' &&
    typeof error.clientVersion === 'string' &&
    (typeof error.meta === 'undefined' || typeof error.meta === 'object')
  );
};
