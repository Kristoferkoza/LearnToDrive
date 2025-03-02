import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,20}$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  phoneNumber: string;

  @IsNumber()
  age: number;

  @IsBoolean()
  active: boolean;
}
