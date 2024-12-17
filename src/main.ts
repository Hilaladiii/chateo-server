import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './common/constants';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
