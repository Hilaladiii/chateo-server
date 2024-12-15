import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const mailOption: MailerAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      transport: {
        service: 'Gmail',
        auth: {
          user: configService.get<string>('MAILER_USER'),
          pass: configService.get<string>('MAILER_PASS'),
        },
      },
    };
  },
  inject: [ConfigService],
};
