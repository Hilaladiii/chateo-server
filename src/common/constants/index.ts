import { ConfigService } from '@nestjs/config';

export const configService = new ConfigService();

export const jwtConstant = configService.get('JWT_SECRET');
