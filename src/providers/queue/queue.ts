import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

@Processor('email')
export class EmailQueue {
  constructor(private mailService: MailerService) {}

  @Process('verification-email')
  async verificationEmail(job: Job) {
    const { email, verificationCode } = job.data;

    try {
      await this.mailService.sendMail({
        from: 'abdulhilal242@gmail.com',
        to: email,
        subject: 'Verify your chateo account',
        html: `<p>Your verification code ${verificationCode}</p>`,
      });
    } catch (error) {
      console.log('error from email mailer', error);
      throw error;
    }
  }
}
