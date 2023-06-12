import { DatabaseError } from '../errors/database.error';
import { PrismaClientError } from '../errors/prisma-client.error';
import { UniqueConstraintError } from '../errors/unique-constraint.error';
import { IdConstraintError } from '../errors/id-constraint.error';
import { NotFoundConstraintError } from '../errors/not-found-constraint.error';
import { ConflictConstraintError } from '../errors/conflict-constraint.error';

const prismaErrors = {
  P2002: (error: PrismaClientError) => new UniqueConstraintError(error),
  P2014: () => new ConflictConstraintError(),
  P2023: (error: PrismaClientError) => new IdConstraintError(error),
  P2025: () => new NotFoundConstraintError(),
};

export const handlePrismaErrors = (error: PrismaClientError) => {
  console.error(error);
  const prismaError = prismaErrors[error.code];

  return prismaError
    ? prismaError(error)
    : new DatabaseError('Erro desconhecido.');
};
