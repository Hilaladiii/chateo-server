import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserService } from './user.service';
import { Message } from 'src/common/decorators/message.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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

  @Get('profile')
  @Message('Success get user profile')
  async getProfile() {
    return this.userService.getProfile('67500ddd32a8fa226aef24d2');
  }
}
