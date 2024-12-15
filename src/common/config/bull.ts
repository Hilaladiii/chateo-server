import { SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const bullConfig: SharedBullAsyncConfiguration = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    },
  }),
  inject: [ConfigService],
};
