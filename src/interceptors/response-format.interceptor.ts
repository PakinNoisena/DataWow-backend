import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../interface/api.response.interface";

@Injectable()
export class ResponseFormat implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(
        (data): ApiResponse => ({
          data,
          success: true,
        })
      )
    );
  }
}
