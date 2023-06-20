import { DatabaseError } from './database.error';

export class NotFoundConstraintError extends DatabaseError {
  constructor() {
    super('Registro não encontrado');
  }
}
