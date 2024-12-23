import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  isGroup: boolean;

  @IsNotEmpty()
  @IsObject()
  members: { id: string }[];

  @IsNotEmpty()
  @IsString()
  name: string;
}
