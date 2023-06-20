import { ConflictError } from './conflict.error';
import { PrismaClientError } from './prisma-client.error';

enum AttributeTraductionBR {
  cpf = 'CPF',
  email = 'E-mail',
  accusedId = 'id',
}

const formatTarget = (target: string | unknown) => {
  if (typeof target !== 'string') return target;
  const [, attribute] = target.split('_');
  return AttributeTraductionBR[attribute];
};

export class UniqueConstraintError extends ConflictError {
  constructor(error: PrismaClientError) {
    const target = formatTarget(error.meta.target);
    super(`Já existe um registro com este ${target}`);
  }
}
