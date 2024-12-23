import { IsNotEmpty, IsString } from 'class-validator';

export class SaveContactDto {
  @IsNotEmpty()
  @IsString()
  userSavedId: string;
}
