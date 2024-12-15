import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { EmailQueue } from './providers/queue/queue';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    RedisModule,
  ],
  providers: [EmailQueue],
})
export class AppModule {}
