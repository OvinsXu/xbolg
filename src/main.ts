import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
import * as ReqIP from 'request-ip';

import { AppModule } from './app.module';
import { GlobalMiddleware } from './common/middlewares/global.middleware';
import { GlobalGuard } from './common/guards/global.guard';
import { GlobalInterceptor } from './common/interceptors/global.interceptor';

import { GlobalFilter } from './common/filters/global.filter';
import { ValidationPipe } from '@nestjs/common';
import { loggerConsole, loggerFile } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [loggerConsole, loggerFile],
    }),
  });

  const config = new DocumentBuilder()
    .setTitle('xbolg example')
    .setDescription('The xbolg API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.use(ReqIP.mw());

  app.use(new GlobalMiddleware().use);
  app.useGlobalGuards(new GlobalGuard());
  app.useGlobalInterceptors(new GlobalInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalFilter());

  app.enableCors();

  await app.listen(4000);
}
bootstrap();
