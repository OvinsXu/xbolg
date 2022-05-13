import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('全局请求拦截器');
    return next.handle().pipe(
      map((data) => {
        console.log('全局响应拦截器');
        return {
          data: data,
        };
      }),
    );
  }
}
