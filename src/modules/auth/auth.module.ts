import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/common/constants';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({ global: false, secret: jwtConstant })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
