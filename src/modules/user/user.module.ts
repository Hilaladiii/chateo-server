import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailOption } from 'src/common/config/mailer';
import { BullModule } from '@nestjs/bull';
import { bullConfig } from 'src/common/config/bull';

@Module({
  imports: [
    MailerModule.forRootAsync(mailOption),
    BullModule.forRootAsync(bullConfig),
    BullModule.registerQueue({ name: 'email' }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
