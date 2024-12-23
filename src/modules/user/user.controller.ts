import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserService } from './user.service';
import { Message } from 'src/common/decorators/message.decorator';
import { VerifyUserDto } from './dtos/verify-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Message('Success get all users')
  async getAll() {
    return await this.userService.getAll();
  }

  @Post('register')
  @Message(
    'success register your account, please check your email for verification',
  )
  async register(@Body() registeruserDto: RegisterUserDto) {
    const user = await this.userService.getUserByEmail(registeruserDto.email);
    if (user?.email)
      throw new BadRequestException('User with this email already exist!');

    return this.userService.register(registeruserDto);
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @Message('Success verify your account')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    this.userService.verifiyUser(verifyUserDto.email, verifyUserDto.code);
  }

  @Get('profile')
  @Message('Success get user profile')
  async getProfile() {
    return this.userService.getProfile('67500ddd32a8fa226aef24d2');
  }
}
