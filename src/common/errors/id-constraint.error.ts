import { DatabaseError } from './database.error';
import { PrismaClientError } from './prisma-client.error';

const formatMessage = (message: string | unknown) => {
  if (typeof message !== 'string') return message;
  const startIndex = message.indexOf('"');
  const endIndex = message.indexOf('"', startIndex + 1);
  return message.substring(startIndex + 1, endIndex);
};

export class IdConstraintError extends DatabaseError {
  constructor(error: PrismaClientError) {
    const message = formatMessage(error.meta.message);
    super(`O id '${message}' é inválido.`);
  }
}
