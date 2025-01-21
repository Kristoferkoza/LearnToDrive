import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  token: string;


}
