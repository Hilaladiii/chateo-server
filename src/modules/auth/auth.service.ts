import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) throw new BadRequestException('User not found!');

    if (!user.isVerified) throw new BadRequestException('User not verify yet');

    const isPasswordValid = await argon2.verify(
      user.password,
      loginDto.password,
    );

    if (!isPasswordValid)
      throw new BadRequestException('Email or password is incorrect!');

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      },
    );

    const hashedToken = await argon2.hash(token);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: hashedToken,
      },
    });

    return token;
  }
}
