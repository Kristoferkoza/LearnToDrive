import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  login: string;

  @IsNotEmpty()
  password: string;
}