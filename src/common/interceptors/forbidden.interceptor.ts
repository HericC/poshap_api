import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  ForbiddenException,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ForbiddenError } from '../errors/forbidden.error';

@Injectable()
export class ForbiddenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ForbiddenError)
          throw new ForbiddenException(error.message);
        else throw error;
      }),
    );
  }
}
