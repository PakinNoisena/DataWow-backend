import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface ApiResponse {
  success: boolean;
  data?: any;
  messageCode: number;
}

@Injectable()
export class ResponseFormat implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data): ApiResponse => {
        // Process only successful responses
        const messageCode = data?.messageCode || 2000;
        return {
          success: true,
          data,
          messageCode,
        };
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
