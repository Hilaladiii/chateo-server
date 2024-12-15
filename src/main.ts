import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './common/constants';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
