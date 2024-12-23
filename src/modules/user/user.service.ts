import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import * as argon from 'argon2';
import { codeGenerator } from 'src/common/utils/code-generator';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '@prisma/client';
import { IUserProfile } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async getAll() {
    return this.prismaService.user.findMany({
      include: {
        savedUsers: true,
        savedByUsers: true,
      },
    });
  }

  async register(registerUserDto: RegisterUserDto): Promise<IUserProfile> {
    try {
      const hashedPassword = await argon.hash(registerUserDto.password);
      const verificationCode = codeGenerator();

      const createUser = await this.prismaService.user.create({
        data: {
          ...registerUserDto,
          password: hashedPassword,
          verificationCode,
        },
        select: {
          username: true,
          email: true,
          image: true,
          createdAt: true,
        },
      });

      const res = await this.emailQueue.add(
        'verification-email',
        {
          email: createUser.email,
          verificationCode,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
      return createUser;
    } catch (error) {
      console.log(error);
    }
  }

  async getProfile(id: string): Promise<IUserProfile> {
    const profile = await this.prismaService.user.findUnique({
      where: { id },
      select: { username: true, email: true, createdAt: true, image: true },
    });

    if (!profile) throw new NotFoundException('Profile not found!');

    return profile;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async verifiyUser(email: string, code: number): Promise<Boolean> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user.verificationCode != code) return false;

    await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        isVerified: true,
      },
    });

    return true;
  }
}
