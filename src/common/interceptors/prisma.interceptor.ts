import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadRequestException,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPrismaError } from '../utils/is-prisma-error.util';
import { handlePrismaErrors } from '../utils/handle-prisma-errors.util';
import { DatabaseError } from '../errors/database.error';

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (isPrismaError(error)) error = handlePrismaErrors(error);

        if (error instanceof DatabaseError)
          throw new BadRequestException(error.message);
        else throw error;
      }),
    );
  }
}
