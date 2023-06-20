import { ConflictError } from './conflict.error';

export class ConflictConstraintError extends ConflictError {
  constructor() {
    super('Esta operação não pode ser realizada, contate o suporte');
  }
}
