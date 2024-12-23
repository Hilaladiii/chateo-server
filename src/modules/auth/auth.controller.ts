import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Message } from 'src/common/decorators/message.decorator';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Message('Success login into your account')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
