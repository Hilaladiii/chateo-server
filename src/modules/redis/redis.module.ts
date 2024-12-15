import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { redisOption } from 'src/common/config/redis';

@Global()
@Module({
  imports: [CacheModule.registerAsync(redisOption)],
})
export class RedisModule {}
