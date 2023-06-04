import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  ConflictException,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConflictError } from '../errors/conflict.error';

@Injectable()
export class ConflictInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ConflictError)
          throw new ConflictException(error.message);
        else throw error;
      }),
    );
  }
}
