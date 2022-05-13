import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const logger = new Logger();
    logger.verbose('来自' + req.clientIp + '的访问');
    next();
  }
}
