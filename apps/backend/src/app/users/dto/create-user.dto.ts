import { IsBoolean, IsNumber, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsNumber()
  age: number;
  
  @IsString()
  login: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,20}$/, { message: 'password too weak' })
  password: string

  @IsString()
  phoneNumber: string

  @IsBoolean()
  isActive: boolean;
}
